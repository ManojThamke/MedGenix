import React from 'react';

const ClinicalReportPDF = ({ data, formData, userEmail }) => {
  const isHealthy = data?.result === 'Healthy';
  const themeColor = isHealthy ? 'text-green-600' : 'text-red-600';
  const themeBg = isHealthy ? 'bg-green-600' : 'bg-red-600';
  const themeLightBg = isHealthy ? 'bg-green-50' : 'bg-red-50';

  // Use the provided email, or a fallback. 
  // Extract just the name part before the @ symbol for a cleaner look.
  const patientIdentifier = userEmail ? userEmail.split('@')[0].toUpperCase() : 'ANONYMOUS_PT';

  const Page = ({ children, pageNum, total = 3, title }) => (
    <div 
      className="pdf-page bg-white text-slate-800 p-8 relative flex flex-col" 
      style={{ 
        width: '794px', 
        height: '1120px', 
        maxHeight: '1120px',
        pageBreakAfter: 'always',
        pageBreakInside: 'avoid',
        overflow: 'hidden',
        boxSizing: 'border-box',
        transform: 'scale(0.99)', 
        transformOrigin: 'top center'
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900">
            MED<span className="text-[#7c5cfc]">GENIX</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{title}</p>
        </div>
        <div className="text-right text-[9px] font-bold">
          <p className="text-red-500 italic">CONFIDENTIAL MEDICAL DATA</p>
          <p className="text-slate-400 font-mono">ID: {patientIdentifier} | {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow overflow-hidden">
        {children}
      </div>

      {/* Footer */}
      <div className="mt-auto border-t pt-3 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase">
        <span>AI Clinical Diagnostic Suite</span>
        <span>Page {pageNum} of {total}</span>
      </div>
    </div>
  );

  return (
    <div id="pdf-report-template" style={{ 
      display: 'none', 
      backgroundColor: 'white',
      width: '794px' 
    }}>
      <Page pageNum={1} title="Executive Summary">
        <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg mb-4 border border-slate-100">
           <div><p className="text-[9px] font-bold text-slate-400">PATIENT ID</p><p className="text-xs font-bold truncate pr-2">{patientIdentifier}</p></div>
           <div><p className="text-[9px] font-bold text-slate-400">AGE/SEX</p><p className="text-xs font-bold">Unspecified</p></div>
           <div><p className="text-[9px] font-bold text-slate-400">STATUS</p><p className={`text-xs font-bold ${themeColor}`}>{isHealthy ? 'Asymptomatic' : 'Symptomatic'}</p></div>
        </div>

        <div className={`rounded-xl p-5 mb-4 flex justify-between items-center ${themeLightBg} border border-slate-200`}>
          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase">AI Prediction</p>
            <h2 className={`text-3xl font-black ${themeColor}`}>{data?.result || "Pending"}</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase">Confidence</p>
            <p className="text-3xl font-black text-slate-900">{data?.confidence || "0.00"}%</p>
          </div>
        </div>

        <div className="border-l-4 border-[#7c5cfc] bg-[#7c5cfc]/5 p-4 rounded-r-xl mb-6">
          <h3 className="text-xs font-bold text-slate-900 mb-1 uppercase">AI Clinical Insight</h3>
          <p className="text-[11px] leading-relaxed text-slate-600 italic">
            {isHealthy 
              ? "\"Biomarker extraction indicates stable fundamental frequencies. No significant indicators of neuromuscular degeneration observed.\""
              : "\"Biomarker extraction identifies significant micro-tremors in fundamental frequency. Indicators match symptomatic profile.\""}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded border border-slate-100">
             <h4 className="text-[10px] font-bold text-[#7c5cfc] mb-1 uppercase italic underline">Acoustic Metrics</h4>
             <p className="text-[10px] text-slate-500 leading-tight">Jitter and Shimmer values were analyzed for vocal fold coordination irregularities.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-100">
             <h4 className="text-[10px] font-bold text-[#7c5cfc] mb-1 uppercase italic underline">Non-Linear Metrics</h4>
             <p className="text-[10px] text-slate-500 leading-tight">PPE and spread attributes were evaluated for predictability mapping.</p>
          </div>
        </div>
      </Page>

      <Page pageNum={2} title="Data Annex">
        <h3 className="text-xs font-bold text-slate-900 mb-2">Feature Extraction Matrix</h3>
        <table className="w-full text-[9px] border-collapse">
          <thead>
            <tr className="bg-slate-100 border">
              <th className="p-1.5 text-left border">FEATURE</th>
              <th className="p-1.5 text-right border">VALUE</th>
              <th className="p-1.5 text-left border">DOMAIN</th>
            </tr>
          </thead>
          <tbody>
            {featureLabels.slice(0, 20).map((label, i) => (
              <tr key={i} className="border">
                <td className="p-1 border font-mono text-slate-500">{label}</td>
                {/* Ensure we print the actual array value, otherwise fallback to 0.00 ONLY if undefined */}
                <td className="p-1 border text-right font-bold text-[#7c5cfc]">
                  {formData && formData[i] !== undefined && formData[i] !== '' ? formData[i] : '0.00'}
                </td>
                <td className="p-1 border text-slate-400 italic">Digital Signal Analysis</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Page>

      <Page pageNum={3} title="Pathology & Legal">
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-900 mb-3 underline">Clinical Path</h3>
          <div className="space-y-2">
            {[
              ["Neurological Consult", "Formal assessment with Specialist."],
              ["UPDRS Scoring", "Clinical motor evaluation."],
              ["Monitoring", "Re-run analysis in 30 days."],
              ["Imaging", "Consider DaTscan if symptoms persist."]
            ].map(([t, d], i) => (
              <div key={i} className="flex items-start gap-3 p-3 border rounded bg-slate-50/50">
                <span className="text-[10px] font-bold text-[#7c5cfc]">{i+1}</span>
                <div><p className="text-[10px] font-bold">{t}</p><p className="text-[9px] text-slate-500 italic">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto bg-red-50 border border-red-100 p-6 rounded-xl text-center">
          <h4 className="text-xs font-bold text-red-600 mb-2 uppercase">Regulatory Disclaimer</h4>
          <p className="text-[10px] text-red-500 italic px-4">
            Experimental tool. Not a substitute for professional diagnosis. Final report.
          </p>
        </div>
      </Page>
    </div>
  );
};

const featureLabels = [
  "MDVP:Fo(Hz)", "MDVP:Fhi(Hz)", "MDVP:Flo(Hz)", "Jitter(%)", "Jitter(Abs)", "MDVP:RAP", "MDVP:PPQ", "Jitter:DDP",
  "Shimmer", "Shimmer(dB)", "APQ3", "APQ5", "MDVP:APQ", "Shimmer:DDA",
  "NHR", "HNR", "RPDE", "DFA", "spread1", "spread2", "D2", "PPE"
];

export default ClinicalReportPDF;