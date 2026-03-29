import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#060810] text-[#f0f4ff] font-['Space_Grotesk'] relative w-full overflow-x-hidden min-h-screen flex flex-col">
      
      {/* --- BACKGROUND ELEMENTS --- */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(124,92,252,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.035) 1px, transparent 1px)', 
          backgroundSize: '52px 52px' 
        }}
      ></div>
      <div className="absolute top-[-180px] left-[-120px] w-[600px] h-[600px] rounded-full pointer-events-none blur-[70px] z-0" style={{ background: 'radial-gradient(circle, rgba(124,92,252,0.2) 0%, transparent 68%)' }}></div>
      <div className="absolute top-[160px] right-[-120px] w-[500px] h-[500px] rounded-full pointer-events-none blur-[70px] z-0" style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.13) 0%, transparent 68%)' }}></div>
      <div className="absolute bottom-[-60px] left-[20%] w-[700px] h-[350px] rounded-full pointer-events-none blur-[70px] z-0" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 68%)' }}></div>

      {/* --- NAVBAR --- */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* --- 1. HERO SECTION --- */}
      <div className="relative z-10 text-center px-6 md:px-12 pt-[72px] pb-[56px] max-w-[920px] mx-auto w-full">
        <div className="inline-flex items-center gap-2 bg-[#7c5cfc]/10 border border-[#7c5cfc]/30 rounded-full px-4 py-1.5 text-[12px] text-[#a78bfa] font-mono mb-7 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] animate-pulse"></span>
          Powered by Google Gemini AI + Voice Analysis
        </div>
        <h1 className="font-['Syne'] text-[40px] md:text-[74px] font-extrabold leading-[1.05] tracking-tight text-white mb-4">
          Generative AI<br />
          <span className="bg-gradient-to-br from-[#a78bfa] to-[#f472b6] bg-clip-text text-transparent">Clinical Assistant</span><br />
          for Parkinson's
        </h1>
        <p className="text-[16px] md:text-[18px] text-[#6b7a99] leading-[1.68] max-w-[560px] mx-auto mt-5 mb-9">
          Combining machine learning precision with real-time voice analysis and generative AI explanation — making early Parkinson's detection accessible to everyone.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap mb-11">
          <button 
            onClick={() => navigate('/dash')}
            className="text-[15px] font-semibold px-[30px] py-[13px] rounded-lg bg-[#7c5cfc] text-white shadow-[0_0_20px_rgba(124,92,252,0.35)] hover:bg-[#8b6dfd] hover:shadow-[0_0_32px_rgba(124,92,252,0.55)] hover:-translate-y-[1px] transition-all"
          >
            Start Diagnosis →
          </button>
          <button className="text-[15px] font-medium px-[30px] py-[13px] rounded-lg bg-transparent text-white border border-white/20 hover:bg-[#111827] hover:border-white/30 transition-all">
            View Sample Report
          </button>
        </div>
        <div className="flex items-center justify-center gap-[22px] flex-wrap">
          {['95%+ ML Accuracy', '22 Voice Biomarkers', 'Real-time Voice Recording', 'Gemini AI Insights', 'Clinical PDF Reports'].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[12px] font-mono text-[#6b7a99]">
              <span className="w-[5px] h-[5px] rounded-full bg-[#4ade80]"></span>{item}
            </div>
          ))}
        </div>
      </div>

      {/* --- 2. VOICE USP STRIP --- */}
      <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 md:px-12 pb-12">
        <div className="bg-gradient-to-br from-[#22d3ee]/5 to-[#7c5cfc]/5 border border-[#22d3ee]/20 rounded-[18px] p-6 px-7 flex items-center justify-between gap-6 flex-wrap lg:flex-nowrap">
          <div className="flex items-center gap-5 flex-1 min-w-[300px]">
            <div className="w-14 h-14 rounded-xl bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center text-[24px] shrink-0">🎙️</div>
            <div>
              <h4 className="text-[15px] font-bold text-white mb-1.5">🔥 NEW — Real-time Voice Analysis</h4>
              <p className="text-[13px] text-[#6b7a99] leading-[1.6] mb-3">
                Record your voice directly in the browser. Our system extracts 22 clinical biomarkers using Parselmouth (Praat) and runs instant prediction.
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['🎙️ Record Voice', 'WebM → WAV', 'Parselmouth', '22 Features', 'ML Model'].map((step, i, arr) => (
                  <React.Fragment key={i}>
                    <span className="font-mono text-[10px] text-[#22d3ee] bg-[#22d3ee]/10 border border-[#22d3ee]/20 px-2 py-1 rounded-[5px]">{step}</span>
                    {i < arr.length - 1 && <span className="text-[#2a3550] text-[12px]">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dash')}
            className="whitespace-nowrap w-full lg:w-auto text-[13px] font-semibold px-[24px] py-[12px] rounded-lg bg-[#7c5cfc] text-white shadow-[0_0_20px_rgba(124,92,252,0.35)] hover:bg-[#8b6dfd] hover:-translate-y-[1px] transition-all"
          >
            Try Voice Detection
          </button>
        </div>
      </div>

      {/* --- 3. GENAI CARDS --- */}
      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 md:px-12 py-[52px]">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#a78bfa] mb-2.5">What makes us different</div>
        <div className="font-['Syne'] text-[32px] md:text-[38px] font-extrabold tracking-tight text-white mb-2">Powered by Generative AI</div>
        <div className="text-[14px] text-[#6b7a99] mb-8 max-w-[500px] leading-[1.62]">
          Our system doesn't just predict — it explains, advises, and generates clinical documentation automatically.
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-[#0c0f1a] border border-white/5 rounded-[16px] p-[24px] transition-all duration-200 relative overflow-hidden group hover:border-[#7c5cfc]/30 hover:bg-[#111827]">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#7c5cfc]/65 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-[44px] h-[44px] rounded-xl bg-[#7c5cfc]/15 border border-[#7c5cfc]/30 flex items-center justify-center text-[20px] mb-4">🧠</div>
            <div className="text-[16px] font-bold text-white mb-2">AI Clinical Insight</div>
            <div className="text-[13px] text-[#6b7a99] leading-[1.65]">After every prediction, Gemini AI generates a personalized clinical explanation — observation, interpretation, and recommendation — in plain language.</div>
            <span className="inline-block mt-4 font-mono text-[10px] px-2.5 py-1 rounded-[5px] bg-[#7c5cfc]/10 border border-[#7c5cfc]/25 text-[#a78bfa]">gemini-1.5-flash</span>
          </div>
          <div className="bg-[#0c0f1a] border border-white/5 rounded-[16px] p-[24px] transition-all duration-200 relative overflow-hidden group hover:border-[#f472b6]/30 hover:bg-[#111827]">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f472b6]/65 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-[44px] h-[44px] rounded-xl bg-[#f472b6]/10 border border-[#f472b6]/25 flex items-center justify-center text-[20px] mb-4">💬</div>
            <div className="text-[16px] font-bold text-white mb-2">Medical Chat Assistant</div>
            <div className="text-[13px] text-[#6b7a99] leading-[1.65]">Ask any Parkinson's question, request a report explanation, or get guidance on next steps — all powered by Gemini with a medical context system prompt.</div>
            <span className="inline-block mt-4 font-mono text-[10px] px-2.5 py-1 rounded-[5px] bg-[#f472b6]/10 border border-[#f472b6]/25 text-[#f472b6]">conversational AI</span>
          </div>
          <div className="bg-[#0c0f1a] border border-white/5 rounded-[16px] p-[24px] transition-all duration-200 relative overflow-hidden group hover:border-[#22d3ee]/30 hover:bg-[#111827]">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#22d3ee]/65 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-[44px] h-[44px] rounded-xl bg-[#22d3ee]/10 border border-[#22d3ee]/20 flex items-center justify-center text-[20px] mb-4">📄</div>
            <div className="text-[16px] font-bold text-white mb-2">Smart PDF Reports</div>
            <div className="text-[13px] text-[#6b7a99] leading-[1.65]">AI-generated clinical summaries, risk assessments, key feature explanations, and personalized recommendations — all in one downloadable report.</div>
            <span className="inline-block mt-4 font-mono text-[10px] px-2.5 py-1 rounded-[5px] bg-[#22d3ee]/10 border border-[#22d3ee]/25 text-[#22d3ee]">reportlab + gemini</span>
          </div>
        </div>
      </div>

      {/* --- 4. FEATURES GRID --- */}
      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 md:px-12 pt-0 pb-[52px]">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#a78bfa] mb-2.5">Full feature set</div>
        <div className="font-['Syne'] text-[32px] md:text-[38px] font-extrabold tracking-tight text-white mb-2">Everything in one system</div>
        <div className="text-[14px] text-[#6b7a99] mb-[26px] max-w-[500px] leading-[1.62]">Voice recording, manual input, AI explanation, clinical reports, and history — all integrated.</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { i: "🎙️", c: "bg-[#22d3ee]/10", t: "Voice Recording", d: "Record → extract 22 biomarkers → instant prediction via Parselmouth" },
            { i: "⚡", c: "bg-[#7c5cfc]/10", t: "ML Prediction", d: "Random Forest, SVM & Logistic Regression ensemble — 95%+ accuracy" },
            { i: "⚠️", c: "bg-[#f87171]/10", t: "Risk Stratification", d: "HIGH / MODERATE / LOW risk with confidence score per prediction" },
            { i: "🗄️", c: "bg-[#4ade80]/10", t: "MongoDB Records", d: "Every prediction auto-saved with timestamp, risk level, and PDF filename" },
            { i: "🤖", c: "bg-[#f472b6]/10", t: "Gemini AI Chat", d: "Medical Q&A, report explanations, and clinical guidance in real time" },
            { i: "📊", c: "bg-[#fbbf24]/10", t: "Report History", d: "View, filter, preview, and re-download all past clinical reports" }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#0c0f1a] border border-white/5 rounded-[12px] p-5 flex items-start gap-4 transition-colors hover:bg-[#111827]">
              <div className={`w-[36px] h-[36px] rounded-lg ${item.c} flex items-center justify-center text-[16px] shrink-0`}>{item.i}</div>
              <div>
                <div className="text-[14px] font-bold text-white mb-1">{item.t}</div>
                <div className="text-[12px] text-[#6b7a99] leading-[1.5]">{item.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- 5. PROCESS STEPS --- */}
      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 md:px-12 pt-0 pb-[64px]">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#a78bfa] mb-2.5">Process</div>
        <div className="font-['Syne'] text-[32px] md:text-[38px] font-extrabold tracking-tight text-white mb-10">How it works</div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center relative md:after:content-['→'] md:after:absolute md:after:-right-6 md:after:top-[20px] md:after:text-[24px] md:after:text-[#2a3550]">
            <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center font-['Syne'] text-[20px] font-extrabold mx-auto mb-4 border-2 border-[#22d3ee]/40 bg-[#22d3ee]/10 text-[#22d3ee]">1</div>
            <div className="text-[15px] font-bold text-white mb-2">Record or Enter Data</div>
            <div className="text-[13px] text-[#6b7a99] leading-[1.6]">Record your voice for automatic feature extraction, or manually enter 22 biomarker values with demo data available.</div>
          </div>
          <div className="text-center relative md:after:content-['→'] md:after:absolute md:after:-right-6 md:after:top-[20px] md:after:text-[24px] md:after:text-[#2a3550]">
            <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center font-['Syne'] text-[20px] font-extrabold mx-auto mb-4 border-2 border-[#a78bfa]/40 bg-[#a78bfa]/10 text-[#a78bfa]">2</div>
            <div className="text-[15px] font-bold text-white mb-2">ML Analysis</div>
            <div className="text-[13px] text-[#6b7a99] leading-[1.6]">Random Forest model analyzes vocal patterns and returns prediction with confidence score and HIGH/MODERATE/LOW risk level.</div>
          </div>
          <div className="text-center relative">
            <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center font-['Syne'] text-[20px] font-extrabold mx-auto mb-4 border-2 border-[#f472b6]/40 bg-[#f472b6]/10 text-[#f472b6]">3</div>
            <div className="text-[15px] font-bold text-white mb-2">AI Report & Guidance</div>
            <div className="text-[13px] text-[#6b7a99] leading-[1.6]">Gemini AI explains results in plain language, generates a clinical PDF report, and you can chat with the medical AI for follow-up.</div>
          </div>
        </div>
      </div>

      {/* --- 6. CTA BANNER --- */}
      <div className="relative z-10 w-full max-w-[1000px] mx-auto px-6 md:px-12 mb-[70px]">
        <div className="bg-gradient-to-br from-[#7c5cfc]/15 to-[#f472b6]/10 border border-[#7c5cfc]/30 rounded-[20px] p-[34px] md:px-[44px] flex items-center justify-between gap-6 flex-col md:flex-row text-center md:text-left">
          <div>
            <h3 className="font-['Syne'] text-[22px] md:text-[26px] font-extrabold text-white mb-2">Ready to run your first analysis?</h3>
            <p className="text-[14px] text-[#6b7a99]">Voice recording + demo data included — no setup needed to test the full system.</p>
          </div>
          <button 
            onClick={() => navigate('/dash')}
            className="whitespace-nowrap text-[15px] font-bold px-[30px] py-[14px] rounded-xl bg-[#7c5cfc] text-white shadow-[0_4px_20px_rgba(124,92,252,0.4)] hover:bg-[#8b6dfd] hover:-translate-y-[2px] transition-all"
          >
            Open Dashboard →
          </button>
        </div>
      </div>

    </div>
  );
}