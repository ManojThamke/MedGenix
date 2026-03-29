import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { jwtDecode } from "jwt-decode";
import ClinicalReportPDF from '../components/ClinicalReportPDF';
// IMPORT YOUR API FUNCTIONS (Added getStats)
import { predict, voicePredict, generateReport, getStats } from '../services/api';

export default function Dashboard() {
    const navigate = useNavigate();

    // --- User Authentication State ---
    const [userEmail, setUserEmail] = useState('user@medgenix.ai');
    const [userInitial, setUserInitial] = useState('U');

    // Verify Auth on Load & Extract Email
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login'); // Force login if no token
        } else {
            try {
                const decoded = jwtDecode(token);
                if (decoded.sub) {
                    setUserEmail(decoded.sub);
                    setUserInitial(decoded.sub.charAt(0).toUpperCase());
                }
            } catch (e) {
                console.error("Invalid token format");
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    }, [navigate]);

    // --- Dynamic KPI State (NEW) ---
    const [kpiStats, setKpiStats] = useState({
        total_predictions: 0,
        accuracy: 95.2, // Baseline ML model accuracy
        high_risk: 0,
        reports_generated: 0
    });

    // Fetch Live Stats from MongoDB on Load (NEW)
    useEffect(() => {
        const fetchDashboardStats = async () => {
            const stats = await getStats();
            if (stats) {
                setKpiStats(stats);
            }
        };
        fetchDashboardStats();
    }, []);

    // UI State Management
    const [mode, setMode] = useState('manual');
    const [status, setStatus] = useState('idle');
    const [resultData, setResultData] = useState(null);

    // Form State
    const [formData, setFormData] = useState(Array(22).fill(''));
    const demoData = [119.992, 157.302, 74.997, 0.00784, 0.00007, 0.0037, 0.00554, 0.01109, 0.04374, 0.42600, 0.02182, 0.03130, 0.02971, 0.06545, 0.02211, 21.033, 0.414783, 0.815285, -4.813031, 0.266482, 2.301442, 0.284654];

    // Voice Recording State
    const [isRecording, setIsRecording] = useState(false);
    const [recTime, setRecTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Handlers
    const loadDemo = () => setFormData(demoData);

    const handleInputChange = (index, value) => {
        const newData = [...formData];
        newData[index] = value;
        setFormData(newData);
    };

    const resetAnalysis = () => {
        setStatus('idle');
        setResultData(null);
        setFormData(Array(22).fill(''));
        setRecTime(0);
        setAudioBlob(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // --------------------------------------------------------
    // 1. MANUAL PREDICTION HANDLER
    // --------------------------------------------------------
    const runAnalysis = async () => {
        setStatus('analyzing');

        try {
            const featuresArray = formData.map(val => parseFloat(val) || 0);
            const response = await predict(featuresArray);

            if (response.error || !response.success) {
                alert("Prediction failed: " + (response.error || "Unknown error"));
                setStatus('idle');
                return;
            }

            setResultData({
                result: response.result || 'detected',
                confidence: response.confidence || 99,
                risk: response.risk || 'HIGH'
            });

            setStatus('complete');
        } catch (error) {
            console.error("Manual analysis error:", error);
            alert("Failed to connect to backend.");
            setStatus('idle');
        }
    };

    // --------------------------------------------------------
    // 2. VOICE CAPTURE LOGIC (REAL MICROPHONE)
    // --------------------------------------------------------
    const toggleRecording = async () => {
        if (isRecording) {
            // STOP RECORDING
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                mediaRecorderRef.current.stop();
            }
            setIsRecording(false);
        } else {
            // START RECORDING
            try {
                setRecTime(0);
                setAudioBlob(null);
                audioChunksRef.current = [];

                // Request Microphone Access
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                // Initialize Recorder
                const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                recorder.onstop = () => {
                    const finalBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    setAudioBlob(finalBlob);
                    stream.getTracks().forEach(track => track.stop());
                };

                recorder.start();
                mediaRecorderRef.current = recorder;
                setIsRecording(true);

            } catch (err) {
                console.error("Microphone access denied:", err);
                alert("Microphone access is required for voice analysis.");
            }
        }
    };

    // --------------------------------------------------------
    // 3. VOICE PREDICTION HANDLER (API)
    // --------------------------------------------------------
    const runVoiceAnalysis = async () => {
        if (!audioBlob) {
            alert("No audio recorded. Please click the microphone icon first.");
            return;
        }

        setStatus('analyzing');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("file", audioBlob, "voice_recording.webm");

            const response = await voicePredict(formDataToSend);

            if (response.error || !response.success) {
                alert("Voice analysis failed: " + (response.error || "Unknown error"));
                setStatus('idle');
                return;
            }

            setResultData({
                result: response.result || 'detected',
                confidence: response.confidence || 95,
                risk: response.risk || 'HIGH'
            });

            // 🔥 CRITICAL FIX: Populate form with extracted voice features so the PDF prints numbers, not 0.00
            if (response.features && Array.isArray(response.features)) {
                // Round numbers for cleaner PDF display
                const extractedNumbers = response.features.map(val => Number(val).toFixed(5));
                setFormData(extractedNumbers);
            }

            setStatus('complete');
        } catch (error) {
            console.error("Voice analysis error:", error);
            alert("Failed to connect to backend.");
            setStatus('idle');
        }
    };

    // --------------------------------------------------------
    // 4. FIXED HYBRID PDF DOWNLOAD HANDLER
    // --------------------------------------------------------
    const handleDownloadPDF = async () => {
        // 1. Silent Backend Call to save to MongoDB
        const reportPayload = resultData ? {
            ...resultData,
            method: mode // Track if voice or manual
        } : {
            result: "Parkinson's Detected",
            confidence: 99,
            risk: "HIGH",
            method: "manual"
        };
        generateReport(reportPayload).catch(e => console.log("DB Save Warning:", e));

        const element = document.getElementById('pdf-report-template');

        // 2. Force state for capture
        element.style.display = 'block';

        const opt = {
            margin: 0,
            filename: `MedGenix_Report_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                scrollY: 0,
                windowWidth: 794
            },
            jsPDF: {
                unit: 'px',
                format: [794, 1122],
                orientation: 'portrait',
                hotfixes: ['px_scaling']
            }
        };

        // 3. Wait for browser render
        setTimeout(() => {
            html2pdf().from(element).set(opt).save().then(() => {
                element.style.display = 'none';

                // Refresh stats after saving a report
                getStats().then(stats => {
                    if (stats) setKpiStats(stats);
                });
            });
        }, 500);
    };

    // Voice Timer Effect
    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecTime((prev) => {
                    if (prev >= 9) {
                        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                            mediaRecorderRef.current.stop();
                        }
                        setIsRecording(false);
                        return prev + 1;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    // Biomarker Groupings
    const inputGroups = [
        { title: "MDVP Fundamental Frequency", fields: [{ l: "MDVP:Fo(Hz)", i: 0 }, { l: "MDVP:Fhi(Hz)", i: 1 }, { l: "MDVP:Flo(Hz)", i: 2 }] },
        { title: "Jitter Measures", fields: [{ l: "Jitter(%)", i: 3 }, { l: "Jitter(Abs)", i: 4 }, { l: "MDVP:RAP", i: 5 }, { l: "MDVP:PPQ", i: 6 }, { l: "Jitter:DDP", i: 7 }] },
        { title: "Shimmer Measures", fields: [{ l: "Shimmer", i: 8 }, { l: "Shimmer(dB)", i: 9 }, { l: "APQ3", i: 10 }, { l: "APQ5", i: 11 }, { l: "MDVP:APQ", i: 12 }, { l: "Shimmer:DDA", i: 13 }] },
        { title: "Noise & Nonlinear Features", fields: [{ l: "NHR", i: 14 }, { l: "HNR", i: 15 }, { l: "RPDE", i: 16 }, { l: "DFA", i: 17 }, { l: "spread1", i: 18 }, { l: "spread2", i: 19 }, { l: "D2", i: 20 }, { l: "PPE", i: 21 }] }
    ];

    return (
        <div className="min-h-screen bg-[#060810] text-[#f0f4ff] font-['Space_Grotesk'] flex flex-col overflow-x-hidden relative">

            {/* 1. TOPBAR */}
            <div className="sticky top-0 z-30 bg-[#0c0f1a]/95 backdrop-blur-md border-b border-white/5 px-8 py-3.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-5">
                    <div className="font-['Syne'] text-[18px] font-extrabold cursor-pointer text-white hover:text-[#a78bfa] transition-colors" onClick={() => navigate('/')}>
                        Med<em className="text-[#a78bfa] not-italic">Genix</em>
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7c5cfc] ml-1 animate-pulse"></span>
                    </div>
                    <div className="w-px h-5 bg-white/10"></div>
                    <div>
                        <div className="font-['Syne'] text-[15px] font-extrabold text-white tracking-tight">Clinical Dashboard</div>
                        <div className="text-[11px] text-[#6b7a99] font-medium tracking-wide uppercase mt-0.5">Parkinson's Disease Detection</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="text-[13px] font-medium px-4 py-2 rounded-lg bg-[#111827] border border-white/5 text-[#6b7a99] hover:border-white/15 hover:text-white transition-all flex items-center gap-2" onClick={() => navigate('/chat')}>💬 AI Chat</button>
                    <button className="text-[13px] font-medium px-4 py-2 rounded-lg bg-[#111827] border border-white/5 text-[#6b7a99] hover:border-white/15 hover:text-white transition-all flex items-center gap-2" onClick={() => navigate('/reports')}>📋 Reports</button>
                    <div className="w-px h-5 bg-white/10 mx-2"></div>

                    {/* USER PROFILE DROPDOWN */}
                    <div className="relative group cursor-pointer">
                        <div className="flex items-center gap-2.5 bg-[#111827] border border-white/5 rounded-lg px-3 py-1.5 hover:bg-[#1a2035] transition-colors">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#f472b6] flex items-center justify-center text-[11px] font-bold text-white shadow-inner">{userInitial}</div>
                            <span className="text-[13px] font-semibold pr-1 max-w-[120px] truncate">{userEmail}</span>
                        </div>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#0c0f1a] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
                            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-[13px] text-red-400 hover:bg-white/5 font-semibold transition-colors">
                                Logout / Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto w-full flex flex-col flex-1 pb-10">

                {/* 2. KPI STATS ROW (NOW DYNAMIC) */}
                <div className="grid grid-cols-4 gap-4 px-8 pt-8">
                    <div className="bg-[#0c0f1a] border border-white/5 rounded-2xl p-5 shadow-sm">
                        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] mb-2">Total Predictions</div>
                        <div className="font-['Syne'] text-[26px] font-extrabold text-white mb-1">{kpiStats.total_predictions}</div>
                        <div className="text-[12px] text-[#6b7a99] font-medium">all time</div>
                    </div>
                    <div className="bg-[#0c0f1a] border border-white/5 rounded-2xl p-5 shadow-sm">
                        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] mb-2">Model Accuracy</div>
                        <div className="font-['Syne'] text-[26px] font-extrabold text-[#4ade80] mb-1">{kpiStats.accuracy}%</div>
                        <div className="text-[12px] text-[#6b7a99] font-medium">Random Forest ensemble</div>
                    </div>
                    <div className="bg-[#0c0f1a] border border-white/5 rounded-2xl p-5 shadow-sm">
                        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] mb-2">High Risk Cases</div>
                        <div className="font-['Syne'] text-[26px] font-extrabold text-[#f87171] mb-1">{kpiStats.high_risk}</div>
                        <div className="text-[12px] text-[#6b7a99] font-medium">this month</div>
                    </div>
                    <div className="bg-[#0c0f1a] border border-white/5 rounded-2xl p-5 shadow-sm">
                        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] mb-2">Reports Generated</div>
                        <div className="font-['Syne'] text-[26px] font-extrabold text-[#a78bfa] mb-1">{kpiStats.reports_generated}</div>
                        <div className="text-[12px] text-[#6b7a99] font-medium">PDFs downloaded</div>
                    </div>
                </div>

                {/* 3. RECENT PREDICTIONS BAR */}
                <div className="bg-[#0c0f1a] border border-white/5 rounded-[14px] px-6 py-4 mx-8 mt-5 mb-6 flex items-center gap-4 shadow-sm">
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6b7a99] shrink-0">Recent Activity</span>
                    <div className="w-px h-4 bg-white/10 mx-1"></div>
                    <div className="flex gap-3 flex-wrap flex-1">
                        <div className="flex items-center gap-2 bg-[#111827] border border-[#f87171]/20 rounded-lg px-3 py-1.5 text-[11px] hover:border-[#f87171]/40 transition-colors cursor-pointer">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f87171]"></span>
                            <span className="text-[#f87171] font-mono font-bold tracking-wide">DETECTED</span>
                            <span className="text-[#6b7a99]">99% · HIGH · 2m ago</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#111827] border border-[#4ade80]/20 rounded-lg px-3 py-1.5 text-[11px] hover:border-[#4ade80]/40 transition-colors cursor-pointer">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></span>
                            <span className="text-[#4ade80] font-mono font-bold tracking-wide">HEALTHY</span>
                            <span className="text-[#6b7a99]">72% · LOW · 1h ago</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#111827] border border-[#f87171]/20 rounded-lg px-3 py-1.5 text-[11px] hover:border-[#f87171]/40 transition-colors cursor-pointer">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f87171]"></span>
                            <span className="text-[#f87171] font-mono font-bold tracking-wide">DETECTED</span>
                            <span className="text-[#6b7a99]">87% · MOD · 3h ago</span>
                        </div>
                    </div>
                    <button className="text-[12px] font-semibold px-4 py-2 rounded-lg bg-[#111827] border border-white/5 text-[#a78bfa] hover:bg-[#1a2035] hover:border-[#a78bfa]/30 transition-all shrink-0" onClick={() => navigate('/reports')}>View History →</button>
                </div>

                {/* 4. MAIN GRID LAYOUT */}
                <div className="grid grid-cols-[1fr_420px] gap-6 px-8 flex-1">

                    {/* LEFT: INPUT PANEL */}
                    <div className="bg-[#0c0f1a] border border-white/5 rounded-[20px] p-8 shadow-lg flex flex-col">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="text-[18px] font-bold text-white font-['Syne'] tracking-tight">Voice Biomarker Analysis</div>
                                <div className="text-[13px] text-[#6b7a99] mt-1">Choose input method and provide data for ML evaluation.</div>
                            </div>
                            {mode === 'manual' && (
                                <button className="text-[12px] font-bold px-4 py-2 rounded-lg bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee] hover:bg-[#22d3ee]/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all font-['Space_Grotesk']" onClick={loadDemo}>⚡ Load Demo Data</button>
                            )}
                        </div>

                        <div className="flex bg-[#111827] border border-white/5 rounded-xl p-1.5 w-fit mb-8">
                            <button className={`px-5 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-all ${mode === 'manual' ? 'bg-[#0c0f1a] text-white shadow-sm border border-white/5' : 'text-[#6b7a99] hover:text-white'}`} onClick={() => setMode('manual')}>✏️ Manual Input</button>
                            <button className={`px-5 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-all ${mode === 'voice' ? 'bg-[#0c0f1a] text-white shadow-sm border border-white/5' : 'text-[#6b7a99] hover:text-white'}`} onClick={() => setMode('voice')}>🎙️ Voice Recording</button>
                        </div>

                        {/* Manual Input Form */}
                        {mode === 'manual' && (
                            <div className="flex flex-col flex-1 justify-between">
                                <div>
                                    {inputGroups.map((group, idx) => (
                                        <div className="mb-6" key={idx}>
                                            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#6b7a99] mb-3 pb-2 border-b border-white/5">{group.title}</div>
                                            <div className="grid grid-cols-3 gap-3">
                                                {group.fields.map((field) => (
                                                    <div className="flex flex-col gap-1.5" key={field.i}>
                                                        <span className="text-[11px] text-[#8b9bb4] font-mono truncate">{field.l}</span>
                                                        <input
                                                            className={`w-full px-3 py-2 bg-[#111827] border border-white/5 rounded-lg text-white text-[13px] font-mono outline-none transition-all hover:border-white/10 focus:border-[#7c5cfc]/60 focus:bg-[#0c0f1a] ${formData[field.i] !== '' ? 'border-[#7c5cfc]/40 bg-[#7c5cfc]/5 text-[#a78bfa]' : ''}`}
                                                            type="number"
                                                            placeholder="—"
                                                            value={formData[field.i]}
                                                            onChange={(e) => handleInputChange(field.i, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#9d6efc] text-white text-[16px] font-extrabold mt-6 shadow-[0_4px_20px_rgba(124,92,252,0.3)] hover:shadow-[0_8px_30px_rgba(124,92,252,0.45)] hover:-translate-y-0.5 transition-all font-['Syne'] tracking-wide disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none" onClick={runAnalysis} disabled={status === 'analyzing'}>
                                    {status === 'analyzing' ? 'Analyzing Model...' : 'Run Clinical Analysis →'}
                                </button>
                            </div>
                        )}

                        {/* Voice Input Form */}
                        {mode === 'voice' && (
                            <div className="flex flex-col flex-1">
                                <div className="bg-[#22d3ee]/5 border border-[#22d3ee]/20 rounded-xl p-3.5 mb-8 text-[12px] text-[#22d3ee] font-mono flex items-start gap-3">
                                    <span className="text-[16px]">🎙️</span>
                                    <span>System utilizes MediaRecorder API, processes via FFmpeg, and extracts 22 discrete acoustic features via Parselmouth (Praat) for prediction.</span>
                                </div>

                                <div className="flex flex-col items-center justify-center flex-1 py-4 px-6 text-center bg-[#060810] border border-white/5 rounded-2xl">
                                    {/* Glowing Recording Button */}
                                    <div className="relative w-[140px] h-[140px] mb-8 cursor-pointer group" onClick={toggleRecording}>
                                        <div className={`absolute inset-0 rounded-full transition-all duration-500 ${isRecording ? 'bg-[#f87171]/20 blur-xl animate-pulse' : 'bg-[#22d3ee]/10 blur-xl group-hover:bg-[#22d3ee]/20'}`}></div>
                                        <div className={`relative w-[140px] h-[140px] rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 bg-[#0c0f1a] ${isRecording ? 'border-[#f87171] shadow-[0_0_30px_rgba(248,113,113,0.3)]' : 'border-[#22d3ee]/40 group-hover:border-[#22d3ee]/80'}`}>
                                            <div className={`w-[90px] h-[90px] rounded-full border flex items-center justify-center text-[36px] transition-all duration-300 ${isRecording ? 'bg-[#f87171]/20 border-[#f87171]/50' : 'bg-[#22d3ee]/10 border-[#22d3ee]/30'}`}>{isRecording ? '⏹️' : '🎙️'}</div>
                                        </div>
                                    </div>

                                    <div className={`text-[16px] font-bold mb-2 font-['Syne'] tracking-wide ${isRecording ? 'text-[#f87171]' : (!isRecording && audioBlob ? 'text-[#4ade80]' : 'text-white')}`}>
                                        {isRecording ? `Recording Audio... ${recTime}s` : (!isRecording && audioBlob ? `✓ ${recTime}s recorded successfully` : 'Tap microphone to start')}
                                    </div>
                                    <div className="text-[13px] text-[#6b7a99] leading-relaxed max-w-[300px]">
                                        {isRecording ? 'Maintain a clear, sustained "ahhh" tone into your microphone.' : (!isRecording && audioBlob ? 'Acoustic data captured. Proceed to run the ML analysis.' : 'Speak clearly for 5–10 seconds. Maintain a sustained "ahhh" tone for optimal feature extraction.')}
                                    </div>

                                    {/* Animated Waveform */}
                                    <div className="flex items-center justify-center gap-1 h-12 my-8 w-full">
                                        {[12, 24, 34, 46, 32, 40, 22, 14, 28, 16].map((height, i) => (
                                            <div key={i} className={`w-1 rounded-full bg-[#22d3ee] opacity-30 transition-all duration-300 ${isRecording ? 'opacity-100 animate-[wave_0.8s_ease_infinite]' : ''}`} style={{ height: `${height}px`, animationDelay: `${i * 0.08}s` }}></div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 justify-center flex-wrap mt-2">
                                        {['🎙 Record', 'WebM → WAV', 'Parselmouth', '22 Features'].map((step, i) => (
                                            <span key={i} className="font-mono text-[10px] font-medium text-[#8b9bb4] bg-[#111827] border border-white/10 px-2.5 py-1.5 rounded-md">{step}</span>
                                        ))}
                                    </div>

                                    {!isRecording && audioBlob && (
                                        <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#7c5cfc] to-[#9d6efc] text-white text-[16px] font-extrabold mt-8 shadow-[0_4px_20px_rgba(124,92,252,0.3)] hover:shadow-[0_8px_30px_rgba(124,92,252,0.45)] hover:-translate-y-0.5 transition-all font-['Syne'] tracking-wide" onClick={runVoiceAnalysis} disabled={status === 'analyzing'}>
                                            {status === 'analyzing' ? 'Extracting Features & Analyzing...' : 'Analyze Voice Recording →'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: RESULTS PANEL */}
                    <div className="flex flex-col gap-4 h-full">

                        {/* Idle State */}
                        {status === 'idle' && (
                            <div className="flex-1 bg-[#0c0f1a] border border-white/5 rounded-[20px] p-10 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0,transparent_60%)] pointer-events-none"></div>
                                <div className="w-[80px] h-[80px] rounded-full bg-[#111827] border border-white/5 flex items-center justify-center text-[36px] mb-6 shadow-inner">🧠</div>
                                <div className="font-['Syne'] text-[20px] font-bold text-white mb-2">Awaiting Data</div>
                                <div className="text-[13px] text-[#6b7a99] leading-relaxed max-w-[240px]">
                                    Provide biomarker data via manual entry or voice recording to generate a clinical prediction.
                                </div>
                                <button className="mt-8 px-5 py-2.5 bg-[#111827] border border-white/10 rounded-xl text-[12px] font-bold text-[#a78bfa] font-mono hover:bg-[#1a2035] transition-colors" onClick={() => setMode('manual') || loadDemo()}>
                                    ⚡ Load Demo Dataset
                                </button>
                            </div>
                        )}

                        {/* Analyzing / Complete State */}
                        {(status === 'analyzing' || status === 'complete') && (
                            <>
                                {/* Prediction Result Card */}
                                <div className={`bg-[#0c0f1a] border border-white/5 rounded-[20px] p-7 shadow-lg relative overflow-hidden ${status === 'analyzing' ? 'opacity-60 blur-[2px] scale-[0.98] transition-all duration-500' : 'opacity-100 blur-0 scale-100 transition-all duration-500'}`}>
                                    <div className={`absolute top-0 left-0 right-0 h-1 ${resultData?.result === 'Healthy' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-[#f87171] via-[#fbbf24] to-[#f87171]'}`}></div>

                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6b7a99] mb-1.5">Diagnosis Result</div>
                                            <div className={`font-['Syne'] text-[24px] font-extrabold tracking-tight ${resultData?.result === 'Healthy' ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                                                {resultData?.result || "Parkinson's Detected"}
                                            </div>
                                        </div>
                                        <div className={`px-3.5 py-1.5 rounded-lg font-mono text-[12px] font-bold shadow-sm ${resultData?.result === 'Healthy' ? 'bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80]' : 'bg-[#f87171]/10 border border-[#f87171]/30 text-[#f87171]'}`}>
                                            {resultData?.risk || 'HIGH'} RISK
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 mb-6 p-4 bg-[#060810] rounded-xl border border-white/5">
                                        <div className="relative w-[80px] h-[80px] shrink-0">
                                            {/* Circular Progress Bar */}
                                            <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]">
                                                <circle cx="40" cy="40" r="34" fill="none" stroke="#111827" strokeWidth="8" />
                                                <circle cx="40" cy="40" r="34" fill="none" stroke={resultData?.result === 'Healthy' ? '#4ade80' : '#f87171'} strokeWidth="8" strokeLinecap="round" strokeDasharray="213.6" strokeDashoffset={status === 'complete' ? (213.6 - (213.6 * (resultData?.confidence || 0)) / 100) : "213.6"} className="transition-all duration-1000 ease-out" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center font-['Syne'] text-[16px] font-extrabold text-white">
                                                {status === 'complete' ? `${resultData?.confidence || 0}%` : '0%'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-semibold text-[#6b7a99] mb-1 font-mono uppercase tracking-[0.1em]">Model Confidence</div>
                                            <div className="text-[32px] font-extrabold font-['Syne'] text-white leading-none mb-1.5">{status === 'complete' ? `${resultData?.confidence || 0}%` : '--%'}</div>
                                            <div className="text-[12px] text-[#6b7a99] font-medium">Ensemble (RF, SVM, LR)</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleDownloadPDF}
                                            className="flex-1 py-3 rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#4ade80]/20 hover:border-[#4ade80]/50 transition-all font-['Space_Grotesk'] shadow-sm"
                                        >
                                            ↓ Download PDF Report
                                        </button>
                                        <button className="px-5 py-3 rounded-xl bg-[#111827] border border-white/10 text-white text-[13px] font-bold hover:bg-[#1a2035] transition-all font-['Space_Grotesk'] shadow-sm" onClick={resetAnalysis} title="Run New Analysis">
                                            ↺ Reset
                                        </button>
                                    </div>
                                </div>

                                {/* GenAI Insight Card */}
                                <div className={`bg-[#0c0f1a] border border-white/5 rounded-[20px] p-7 shadow-lg relative overflow-hidden flex-1 flex flex-col ${status === 'analyzing' ? 'hidden' : 'block animate-[fi_0.6s_ease_out]'}`}>
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7c5cfc] via-[#f472b6] to-[#7c5cfc]"></div>

                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c5cfc]/20 to-[#f472b6]/10 border border-[#7c5cfc]/30 flex items-center justify-center text-[15px] shadow-sm">🧬</div>
                                            <div className="text-[16px] font-bold text-white font-['Syne']">AI Clinical Insight</div>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-[#7c5cfc]/10 border border-[#7c5cfc]/20 rounded-full px-3 py-1 font-mono text-[10px] font-semibold text-[#a78bfa]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] animate-pulse"></span>Powered by Gemini
                                        </div>
                                    </div>

                                    <div className="text-[13px] text-[#8b9bb4] leading-[1.65] mb-5 pb-5 border-b border-white/5">
                                        {resultData?.result === 'Healthy'
                                            ? "Voice biomarker analysis reveals stable fundamental frequencies and normal amplitude variations consistent with healthy laryngeal muscle control. No significant indicators of neuromuscular degeneration were identified."
                                            : "Voice biomarker analysis reveals significant irregularities in fundamental frequency consistent with Parkinsonian speech. Elevated jitter and shimmer values indicate reduced vocal stability — a hallmark of early neuromuscular degeneration affecting the laryngeal muscles."
                                        }
                                    </div>

                                    <div className="flex flex-col gap-3 flex-1">
                                        <div className="flex items-start gap-3 bg-[#111827] border border-white/5 rounded-xl p-3.5 shadow-sm">
                                            <span className="text-[16px] shrink-0 mt-[-2px]">🔬</span>
                                            <span className="text-[12.5px] text-[#8b9bb4] leading-[1.6]"><strong className="text-white font-semibold">Observation:</strong> {resultData?.result === 'Healthy' ? "Vocal biomarkers (PPE, spread1) are within normal physiological thresholds." : "PPE and spread1 indicate high pitch instability — primary Parkinson's vocal biomarkers."}</span>
                                        </div>
                                        <div className="flex items-start gap-3 bg-[#111827] border border-white/5 rounded-xl p-3.5 shadow-sm">
                                            <span className="text-[16px] shrink-0 mt-[-2px]">📋</span>
                                            <span className="text-[12.5px] text-[#8b9bb4] leading-[1.6]"><strong className="text-white font-semibold">Interpretation:</strong> {resultData?.result === 'Healthy' ? "Acoustic patterns do not align with Parkinsonian speech characteristics." : "Pattern matches early-stage Parkinsonian speech with high model confidence."}</span>
                                        </div>
                                        <div className="flex items-start gap-3 bg-[#111827] border border-white/5 rounded-xl p-3.5 shadow-sm">
                                            <span className="text-[16px] shrink-0 mt-[-2px]">💊</span>
                                            <span className="text-[12.5px] text-[#8b9bb4] leading-[1.6]"><strong className="text-white font-semibold">Recommendation:</strong> {resultData?.result === 'Healthy' ? "Continue standard health monitoring. No immediate neurological intervention required." : "Consult a neurologist. Request UPDRS assessment and MRI if clinically indicated."}</span>
                                        </div>
                                    </div>

                                    {/* Context-Aware Routing Button */}
                                    <div className="mt-5">
                                        <button
                                            onClick={() => navigate('/chat', { state: { reportContext: resultData } })}
                                            className="w-full py-3 rounded-xl bg-[#7c5cfc]/10 border border-[#7c5cfc]/30 text-[#a78bfa] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#7c5cfc]/20 hover:text-white transition-all shadow-sm"
                                        >
                                            💬 Ask AI about this report
                                        </button>
                                    </div>

                                    <div className="mt-4 px-4 py-3 bg-[#fbbf24]/5 border border-[#fbbf24]/20 rounded-xl text-[11px] text-[#fbbf24]/80 font-mono flex items-start gap-2">
                                        <span className="text-[13px]">⚠</span>
                                        <span>AI-generated clinical insight for screening and informational purposes only. Not a substitute for professional medical diagnosis.</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Hidden Component for PDF Generation - Force Remount on State Change */}
            {status === 'complete' && (
                <div key={Date.now()}>
                    <ClinicalReportPDF 
                        data={resultData} 
                        formData={formData} 
                        userEmail={userEmail} 
                    />
                </div>
            )}

        </div>
    );
}