import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { getHistory } from '../services/api'; // 🔥 IMPORT THE DYNAMIC API FUNCTION

export default function Reports() {
  const navigate = useNavigate();

  // --- Auth & Data State ---
  const [userEmail, setUserEmail] = useState('user@medgenix.ai');
  const [userInitial, setUserInitial] = useState('U');
  
  const [reportsData, setReportsData] = useState([]); // 🔥 NO MORE MOCK DATA
  const [loading, setLoading] = useState(true);

  // --- UI State ---
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const RISK_CFG = {
    high: { label: 'HIGH', color: 'text-[#f87171]', bg: 'bg-[#f87171]/15', border: 'border-[#f87171]/30' },
    moderate: { label: 'MOD', color: 'text-[#fbbf24]', bg: 'bg-[#fbbf24]/15', border: 'border-[#fbbf24]/30' },
    low: { label: 'LOW', color: 'text-[#4ade80]', bg: 'bg-[#4ade80]/15', border: 'border-[#4ade80]/30' }
  };

  // --- Initialize & Fetch Data ---
  useEffect(() => {
    // 1. Verify User Token
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decoded = jwtDecode(token);
        if (decoded.sub) {
            setUserEmail(decoded.sub);
            setUserInitial(decoded.sub.charAt(0).toUpperCase());
        }
      } catch (e) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }

    // 2. Fetch Report History from MongoDB
    const fetchHistory = async () => {
        setLoading(true);
        const data = await getHistory();
        if (data) {
            setReportsData(data);
        }
        setLoading(false);
    };
    fetchHistory();
  }, [navigate]);

  // --- Dynamic KPI Calculations ---
  const kpis = useMemo(() => {
    const total = reportsData.length;
    const detected = reportsData.filter(r => r.result === 'detected').length;
    const healthy = reportsData.filter(r => r.result === 'healthy').length;
    const highRisk = reportsData.filter(r => r.risk === 'high').length;
    
    return {
        total,
        detected,
        detectedPct: total > 0 ? ((detected / total) * 100).toFixed(1) : 0,
        healthy,
        healthyPct: total > 0 ? ((healthy / total) * 100).toFixed(1) : 0,
        highRisk
    };
  }, [reportsData]);

  // --- Derived Filtered Data ---
  const filteredData = useMemo(() => {
    return reportsData.filter(item => {
      // 1. Apply Tag Filter
      if (filter === 'detected' && item.result !== 'detected') return false;
      if (filter === 'healthy' && item.result !== 'healthy') return false;
      if (['high', 'moderate', 'low'].includes(filter) && item.risk !== filter) return false;
      
      // 2. Apply Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.date.includes(query) ||
          item.file.toLowerCase().includes(query) ||
          item.result.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [filter, searchQuery, reportsData]);

  const activeReportDetails = useMemo(() => {
    return reportsData.find(r => r.id === selectedReport);
  }, [selectedReport, reportsData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#060810] text-[#f0f4ff] font-['Space_Grotesk'] flex flex-col">
      
      {/* 1. TOPBAR */}
      <div className="sticky top-0 z-30 bg-[#0c0f1a]/95 backdrop-blur-md border-b border-white/5 px-8 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-5">
          <div className="font-['Syne'] text-[18px] font-extrabold cursor-pointer text-white hover:text-[#a78bfa] transition-colors" onClick={() => navigate('/')}>
            Med<em className="text-[#a78bfa] not-italic">Genix</em>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#7c5cfc] ml-1 animate-pulse"></span>
          </div>
          <div className="w-px h-5 bg-white/10"></div>
          <div>
            <div className="font-['Syne'] text-[15px] font-extrabold text-white tracking-tight">Report History</div>
            <div className="text-[11px] text-[#6b7a99] font-medium tracking-wide uppercase mt-0.5">All predictions & clinical reports</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-[13px] font-medium px-4 py-2 rounded-lg bg-[#111827] border border-white/5 text-[#6b7a99] hover:border-white/15 hover:text-white transition-all" onClick={() => navigate('/dash')}>← Dashboard</button>
          <button className="text-[13px] font-medium px-4 py-2 rounded-lg bg-[#111827] border border-white/5 text-[#6b7a99] hover:border-white/15 hover:text-white transition-all flex items-center gap-2" onClick={() => navigate('/chat')}>💬 AI Chat</button>
          <div className="w-px h-5 bg-white/10 mx-2"></div>
          
          {/* USER PROFILE DROPDOWN */}
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-2.5 bg-[#111827] border border-white/5 rounded-lg px-3 py-1.5 hover:bg-[#1a2035] transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#f472b6] flex items-center justify-center text-[11px] font-bold text-white shadow-inner">{userInitial}</div>
              <span className="text-[13px] font-semibold pr-1 hidden md:block max-w-[120px] truncate">{userEmail}</span>
            </div>
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0c0f1a] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-[13px] text-red-400 hover:bg-white/5 font-semibold transition-colors">
                    Logout / Disconnect
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="max-w-[1400px] mx-auto w-full px-8 py-8 flex-1 flex flex-col">
        
        {/* Header Row */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-['Syne'] text-[28px] font-extrabold text-white mb-1.5 tracking-tight">Clinical Report History</h1>
            <p className="text-[14px] text-[#6b7a99]">All predictions stored securely in MongoDB · filter · preview · re-download</p>
          </div>
          <button 
            onClick={() => navigate('/dash')}
            className="text-[14px] font-bold px-6 py-2.5 rounded-xl bg-[#7c5cfc] text-white shadow-[0_4px_20px_rgba(124,92,252,0.3)] hover:bg-[#8b6dfd] hover:-translate-y-[1px] transition-all"
          >
            + New Analysis
          </button>
        </div>

        {/* Dynamic Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0c0f1a] border border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#a78bfa]"></div>
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] mb-2">Total Reports</div>
            <div className="font-['Syne'] text-[28px] font-extrabold text-[#a78bfa] mb-1">{kpis.total}</div>
            <div className="text-[12px] text-[#6b7a99] font-medium">all time</div>
          </div>
          <div className="bg-[#0c0f1a] border border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#f87171]"></div>
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] mb-2">Parkinson's Detected</div>
            <div className="font-['Syne'] text-[28px] font-extrabold text-[#f87171] mb-1">{kpis.detected}</div>
            <div className="text-[12px] text-[#6b7a99] font-medium">{kpis.detectedPct}% of cases</div>
          </div>
          <div className="bg-[#0c0f1a] border border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#4ade80]"></div>
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] mb-2">Healthy Results</div>
            <div className="font-['Syne'] text-[28px] font-extrabold text-[#4ade80] mb-1">{kpis.healthy}</div>
            <div className="text-[12px] text-[#6b7a99] font-medium">{kpis.healthyPct}% of cases</div>
          </div>
          <div className="bg-[#0c0f1a] border border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#f87171]"></div>
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] mb-2">High Risk</div>
            <div className="font-['Syne'] text-[28px] font-extrabold text-[#f87171] mb-1">{kpis.highRisk}</div>
            <div className="text-[12px] text-[#6b7a99] font-medium">≥ 80% confidence</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span className="text-[12px] text-[#6b7a99] font-mono font-medium tracking-wide">Filter:</span>
          {[
            { id: 'all', label: `All (${kpis.total})` },
            { id: 'detected', label: `Detected (${kpis.detected})` },
            { id: 'healthy', label: `Healthy (${kpis.healthy})` },
            { id: 'high', label: 'HIGH Risk' },
            { id: 'moderate', label: 'MODERATE' },
            { id: 'low', label: 'LOW' },
          ].map(f => (
            <button 
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-lg text-[12px] font-bold border transition-all ${
                filter === f.id 
                  ? 'bg-[#7c5cfc]/15 border-[#7c5cfc]/40 text-[#a78bfa]' 
                  : 'bg-[#111827] border-white/5 text-[#6b7a99] hover:border-white/15 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
          
          <div className="flex-1 min-w-[200px] ml-auto">
            <input 
              type="text"
              placeholder="🔍 Search by ID or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-[300px] float-right px-4 py-2.5 bg-[#111827] border border-white/10 rounded-xl text-white text-[13px] font-['Space_Grotesk'] outline-none transition-all placeholder:text-[#6b7a99] focus:border-[#7c5cfc]/60 focus:bg-[#0c0f1a] shadow-inner"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#0c0f1a] border border-white/5 rounded-2xl overflow-hidden shadow-lg flex-1 flex flex-col relative">
          
          {loading && (
            <div className="absolute inset-0 bg-[#0c0f1a]/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <span className="w-8 h-8 border-4 border-[#7c5cfc] border-t-transparent rounded-full animate-spin"></span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#111827] border-b border-white/10">
                  <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] font-semibold py-4 px-6">ID #</th>
                  <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] font-semibold py-4 px-6">Date & Time</th>
                  <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] font-semibold py-4 px-6">Result</th>
                  <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] font-semibold py-4 px-6">Confidence</th>
                  <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] font-semibold py-4 px-6">Risk Level</th>
                  <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] font-semibold py-4 px-6">Input Method</th>
                  <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] font-semibold py-4 px-6">Report File</th>
                  <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] font-semibold py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => {
                  const rCfg = RISK_CFG[row.risk] || RISK_CFG['low'];
                  const isDet = row.result === 'detected';
                  const confColor = row.conf >= 80 ? '#f87171' : row.conf >= 60 ? '#fbbf24' : '#4ade80';

                  return (
                    <tr key={row.id} className="border-b border-white/5 hover:bg-[#111827]/50 transition-colors group">
                      <td className="py-4 px-6 text-[11px] text-[#6b7a99] font-mono tracking-wider">{row.id}</td>
                      <td className="py-4 px-6">
                        <div className="text-[13px] text-white font-medium">{row.date}</div>
                        <div className="text-[10px] text-[#6b7a99] font-mono mt-0.5">{row.time}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold font-mono tracking-wide ${isDet ? 'bg-[#f87171]/10 border border-[#f87171]/30 text-[#f87171]' : 'bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80]'}`}>
                          {isDet ? 'DETECTED' : 'HEALTHY'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-[60px] h-[5px] bg-[#1a2035] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${row.conf}%`, backgroundColor: confColor }}></div>
                          </div>
                          <span className="text-[12px] font-bold font-mono" style={{ color: confColor }}>{row.conf}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold font-mono border ${rCfg.bg} ${rCfg.border} ${rCfg.color}`}>
                          {rCfg.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[12px] text-[#8b9bb4] capitalize">
                        <span className="mr-1.5">{row.method === 'voice' ? '🎙️' : '✏️'}</span>
                        {row.method}
                      </td>
                      <td className="py-4 px-6 text-[11px] text-[#6b7a99] font-mono truncate max-w-[150px]" title={row.file}>
                        {row.file.replace('MedGenix_Report_', '').replace('.pdf', '')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setSelectedReport(row.id)}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#7c5cfc]/10 border border-[#7c5cfc]/30 text-[#a78bfa] hover:bg-[#7c5cfc]/20 transition-colors flex items-center gap-1.5"
                          >
                            <span className="text-[13px] mt-[-1px]">👁</span> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Empty State */}
            {!loading && filteredData.length === 0 && (
              <div className="py-16 text-center text-[#6b7a99]">
                <div className="text-[40px] opacity-40 mb-3">🗄️</div>
                <div className="text-[14px] font-bold text-white mb-1">No reports found</div>
                <div className="text-[12px]">Try adjusting your filters or record a new analysis.</div>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          <div className="mt-auto px-6 py-4 border-t border-white/5 bg-[#111827]/50 flex items-center justify-between">
            <span className="text-[12px] text-[#6b7a99]">Showing {filteredData.length > 0 ? '1' : '0'}–{filteredData.length} reports</span>
          </div>
        </div>
      </div>

      {/* 3. REPORT PREVIEW MODAL */}
      {selectedReport && activeReportDetails && (
        <div className="fixed inset-0 z-50 bg-[#030508]/90 backdrop-blur-sm flex items-center justify-center p-4 animate-[fi_0.2s_ease_out]">
          <div className="bg-[#0c0f1a] border border-white/10 rounded-[24px] w-full max-w-[680px] max-h-[90vh] flex flex-col relative shadow-2xl">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-white/10 flex items-start justify-between shrink-0">
              <div>
                <h2 className="font-['Syne'] text-[22px] font-extrabold text-white tracking-tight mb-1">MedGenix AI Clinical Report</h2>
                <div className="font-mono text-[11px] text-[#6b7a99]">Generated: {activeReportDetails.date} {activeReportDetails.time}:00</div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="w-8 h-8 rounded-lg bg-[#111827] border border-white/10 text-[#6b7a99] hover:text-white hover:bg-white/5 transition-all flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6b7a99] mb-1.5">Report File</div>
                  <div className="font-mono text-[12px] text-white break-all">{activeReportDetails.file.replace('.pdf','')}</div>
                </div>
                <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6b7a99] mb-1.5">Input Method</div>
                  <div className="text-[13px] font-semibold text-white capitalize">{activeReportDetails.method === 'voice' ? '🎙️ Voice Recording' : '✏️ Manual Input'}</div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#a78bfa] font-semibold">AI Prediction Summary</span>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>
                <div className="bg-[#060810] border border-white/5 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-[#6b7a99] uppercase tracking-wider mb-1 font-mono">Diagnosis Result</div>
                    <div className={`font-['Syne'] text-[20px] font-extrabold ${activeReportDetails.result === 'detected' ? 'text-[#f87171]' : 'text-[#4ade80]'}`}>
                      {activeReportDetails._raw.result || (activeReportDetails.result === 'detected' ? "Parkinson's Detected" : "Healthy")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-[#6b7a99] uppercase tracking-wider mb-1 font-mono">Confidence</div>
                    <div className="text-[24px] font-bold text-white font-['Syne'] leading-none">{activeReportDetails.conf}%</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#a78bfa] font-semibold">Model Analysis</span>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>
                <p className="text-[13px] text-[#8b9bb4] leading-[1.65] bg-[#111827] p-4 rounded-xl border border-white/5">
                  The prediction is based on patterns observed in voice biomarkers such as pitch variation (MDVP:Fo), amplitude instability (Shimmer), and frequency irregularities (Jitter). The Random Forest ensemble model analyzed all 22 features simultaneously.
                </p>
              </div>

              {activeReportDetails.result === 'detected' && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#a78bfa] font-semibold">Key Contributing Features</span>
                    <div className="h-px flex-1 bg-white/5"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2.5 text-[13px] text-[#8b9bb4] leading-[1.6]">
                      <span className="text-[#a78bfa] mt-[2px]">•</span> <strong>PPE</strong> → Indicates pitch instability (primary biomarker)
                    </div>
                    <div className="flex items-start gap-2.5 text-[13px] text-[#8b9bb4] leading-[1.6]">
                      <span className="text-[#a78bfa] mt-[2px]">•</span> <strong>spread1</strong> → Reflects non-linear vocal variation
                    </div>
                    <div className="flex items-start gap-2.5 text-[13px] text-[#8b9bb4] leading-[1.6]">
                      <span className="text-[#a78bfa] mt-[2px]">•</span> <strong>MDVP:Fo</strong> → Represents fundamental frequency shifts
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-2 px-4 py-3 bg-[#fbbf24]/5 border border-[#fbbf24]/20 rounded-xl text-[11px] text-[#fbbf24]/80 font-mono flex items-start gap-2">
                <span className="text-[13px]">⚠</span>
                <span>This report is generated using AI-based analysis for screening purposes only. It should not replace professional medical diagnosis.</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-8 py-5 border-t border-white/10 flex items-center gap-3 shrink-0 bg-[#0c0f1a] rounded-b-[24px]">
              <button 
                onClick={() => {
                    // Navigate to Chat and pass the RAW report data context
                    navigate('/chat', { state: { reportContext: activeReportDetails._raw } })
                }}
                className="flex-1 py-3 rounded-xl bg-[#7c5cfc]/10 border border-[#7c5cfc]/30 text-[#a78bfa] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#7c5cfc]/20 hover:text-white transition-all shadow-sm"
              >
                💬 Ask AI about this report
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* Embedded Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fi {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a2035; border-radius: 4px; }
      `}} />
    </div>
  );
}