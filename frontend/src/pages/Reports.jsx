import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Reports() {
  const navigate = useNavigate();

  // --- Mock Data (From HTML) ---
  const MOCK_DATA = [
    { id: 247, date: '2026-03-29', time: '14:30', result: 'detected', conf: 99, risk: 'high', method: 'voice', file: 'MedGenix_Report_20260329_143022.pdf' },
    { id: 246, date: '2026-03-29', time: '11:15', result: 'healthy', conf: 72, risk: 'low', method: 'manual', file: 'MedGenix_Report_20260329_111500.pdf' },
    { id: 245, date: '2026-03-28', time: '16:44', result: 'detected', conf: 87, risk: 'moderate', method: 'manual', file: 'MedGenix_Report_20260328_164400.pdf' },
    { id: 244, date: '2026-03-28', time: '09:20', result: 'detected', conf: 94, risk: 'high', method: 'voice', file: 'MedGenix_Report_20260328_092000.pdf' },
    { id: 243, date: '2026-03-27', time: '15:05', result: 'healthy', conf: 61, risk: 'low', method: 'manual', file: 'MedGenix_Report_20260327_150500.pdf' },
    { id: 242, date: '2026-03-27', time: '10:30', result: 'detected', conf: 91, risk: 'high', method: 'voice', file: 'MedGenix_Report_20260327_103000.pdf' },
    { id: 241, date: '2026-03-26', time: '14:00', result: 'detected', conf: 78, risk: 'moderate', method: 'manual', file: 'MedGenix_Report_20260326_140000.pdf' },
    { id: 240, date: '2026-03-26', time: '08:45', result: 'healthy', conf: 55, risk: 'low', method: 'manual', file: 'MedGenix_Report_20260326_084500.pdf' },
    { id: 239, date: '2026-03-25', time: '17:20', result: 'detected', conf: 96, risk: 'high', method: 'voice', file: 'MedGenix_Report_20260325_172000.pdf' },
    { id: 238, date: '2026-03-25', time: '13:10', result: 'detected', conf: 83, risk: 'high', method: 'manual', file: 'MedGenix_Report_20260325_131000.pdf' },
  ];

  const RISK_CFG = {
    high: { label: 'HIGH', color: 'text-[#f87171]', bg: 'bg-[#f87171]/15', border: 'border-[#f87171]/30' },
    moderate: { label: 'MOD', color: 'text-[#fbbf24]', bg: 'bg-[#fbbf24]/15', border: 'border-[#fbbf24]/30' },
    low: { label: 'LOW', color: 'text-[#4ade80]', bg: 'bg-[#4ade80]/15', border: 'border-[#4ade80]/30' }
  };

  // --- State ---
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState(null); // Holds the ID of the report to show in modal

  // --- Derived Data ---
  const filteredData = useMemo(() => {
    return MOCK_DATA.filter(item => {
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
          item.result.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [filter, searchQuery]);

  const activeReportDetails = useMemo(() => {
    return MOCK_DATA.find(r => r.id === selectedReport);
  }, [selectedReport]);

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
          <div className="flex items-center gap-2.5 bg-[#111827] border border-white/5 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-[#1a2035] transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c5cfc] to-[#f472b6] flex items-center justify-center text-[11px] font-bold text-white shadow-inner">D</div>
            <span className="text-[13px] font-semibold pr-1 hidden md:block">demo@medgenix.ai</span>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0c0f1a] border border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#a78bfa]"></div>
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] mb-2">Total Reports</div>
            <div className="font-['Syne'] text-[28px] font-extrabold text-[#a78bfa] mb-1">247</div>
            <div className="text-[12px] text-[#6b7a99] font-medium">all time</div>
          </div>
          <div className="bg-[#0c0f1a] border border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#f87171]"></div>
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] mb-2">Parkinson's Detected</div>
            <div className="font-['Syne'] text-[28px] font-extrabold text-[#f87171] mb-1">189</div>
            <div className="text-[12px] text-[#6b7a99] font-medium">76.5% of cases</div>
          </div>
          <div className="bg-[#0c0f1a] border border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#4ade80]"></div>
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] mb-2">Healthy Results</div>
            <div className="font-['Syne'] text-[28px] font-extrabold text-[#4ade80] mb-1">58</div>
            <div className="text-[12px] text-[#6b7a99] font-medium">23.5% of cases</div>
          </div>
          <div className="bg-[#0c0f1a] border border-white/5 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#f87171]"></div>
            <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] mb-2">High Risk</div>
            <div className="font-['Syne'] text-[28px] font-extrabold text-[#f87171] mb-1">112</div>
            <div className="text-[12px] text-[#6b7a99] font-medium">≥ 80% confidence</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <span className="text-[12px] text-[#6b7a99] font-mono font-medium tracking-wide">Filter:</span>
          {[
            { id: 'all', label: 'All (247)' },
            { id: 'detected', label: 'Detected (189)' },
            { id: 'healthy', label: 'Healthy (58)' },
            { id: 'high', label: 'HIGH Risk (112)' },
            { id: 'moderate', label: 'MODERATE (67)' },
            { id: 'low', label: 'LOW (68)' },
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
              placeholder="🔍 Search by date or result..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-[300px] float-right px-4 py-2.5 bg-[#111827] border border-white/10 rounded-xl text-white text-[13px] font-['Space_Grotesk'] outline-none transition-all placeholder:text-[#6b7a99] focus:border-[#7c5cfc]/60 focus:bg-[#0c0f1a] shadow-inner"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#0c0f1a] border border-white/5 rounded-2xl overflow-hidden shadow-lg flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#111827] border-b border-white/10">
                  <th className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6b7a99] font-semibold py-4 px-6">#</th>
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
                  const rCfg = RISK_CFG[row.risk];
                  const isDet = row.result === 'detected';
                  const confColor = row.conf >= 80 ? '#f87171' : row.conf >= 60 ? '#fbbf24' : '#4ade80';

                  return (
                    <tr key={row.id} className="border-b border-white/5 hover:bg-[#111827]/50 transition-colors group">
                      <td className="py-4 px-6 text-[11px] text-[#6b7a99] font-mono">#{row.id}</td>
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
                      <td className="py-4 px-6 text-[12px] text-[#8b9bb4]">
                        <span className="mr-1.5">{row.method === 'voice' ? '🎙️' : '✏️'}</span>
                        {row.method === 'voice' ? 'Voice' : 'Manual'}
                      </td>
                      <td className="py-4 px-6 text-[11px] text-[#6b7a99] font-mono truncate max-w-[150px]">
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
                          <button className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/20 transition-colors flex items-center gap-1.5">
                            ↓ PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Empty State */}
            {filteredData.length === 0 && (
              <div className="py-16 text-center text-[#6b7a99]">
                <div className="text-[40px] opacity-40 mb-3">🗄️</div>
                <div className="text-[14px] font-bold text-white mb-1">No reports found</div>
                <div className="text-[12px]">Try adjusting your filters or search query.</div>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          <div className="mt-auto px-6 py-4 border-t border-white/5 bg-[#111827]/50 flex items-center justify-between">
            <span className="text-[12px] text-[#6b7a99]">Showing {filteredData.length > 0 ? '1' : '0'}–{Math.min(10, filteredData.length)} of {MOCK_DATA.length} reports</span>
            <div className="flex gap-1.5">
              <button className="w-[30px] h-[30px] rounded-lg text-[12px] font-bold bg-[#7c5cfc]/15 border border-[#7c5cfc]/40 text-[#a78bfa] flex items-center justify-center">1</button>
              <button className="w-[30px] h-[30px] rounded-lg text-[12px] font-bold bg-transparent border border-white/10 text-[#6b7a99] hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center">2</button>
              <button className="w-[30px] h-[30px] rounded-lg text-[12px] font-bold bg-transparent border border-white/10 text-[#6b7a99] hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center">3</button>
            </div>
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
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6b7a99] mb-1.5">Report ID</div>
                  <div className="font-mono text-[12px] text-white break-all">{activeReportDetails.file.replace('.pdf','')}</div>
                </div>
                <div className="bg-[#111827] rounded-xl p-4 border border-white/5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#6b7a99] mb-1.5">Input Method</div>
                  <div className="text-[13px] font-semibold text-white">{activeReportDetails.method === 'voice' ? '🎙️ Voice Recording' : '✏️ Manual Input'}</div>
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
                      {activeReportDetails.result === 'detected' ? "Parkinson's Detected" : "Healthy"}
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
              <button className="flex-1 py-3 rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#4ade80]/20 transition-all shadow-sm">
                ↓ Download PDF Report
              </button>
              <button 
                onClick={() => navigate('/chat')}
                className="px-6 py-3 rounded-xl bg-[#7c5cfc]/10 border border-[#7c5cfc]/30 text-[#a78bfa] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#7c5cfc]/20 hover:text-white transition-all shadow-sm"
              >
                💬 Ask AI about this
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