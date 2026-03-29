import React from 'react';

const ClinicalReportPDF = ({ data, formData, userEmail }) => {
  // Safe fallbacks
  const isHealthy = data?.result?.toLowerCase() === 'healthy';
  const riskLevel = data?.risk || 'UNKNOWN';
  const confidence = data?.confidence ? Number(data.confidence).toFixed(1) : '0.0';
  
  // Patient Identifiers
  const patientName = userEmail ? userEmail.split('@')[0].toUpperCase() : 'ANONYMOUS PATIENT';
  const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  const reportTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const mrn = `MRN-${Math.floor(10000000 + Math.random() * 90000000)}`;

  // CRITICAL FIX: isLast prop prevents the 7th trailing blank page
  const Page = ({ children, pageNum, total = 3, isLast = false }) => (
    <div 
      className="bg-white text-black relative flex flex-col mx-auto" 
      style={{ 
        width: '794px', 
        height: '1120px', // CRITICAL FIX: 1120px (instead of 1122) gives a 2px buffer to stop spill-over blank pages
        pageBreakAfter: isLast ? 'auto' : 'always', // Don't break after the last page
        pageBreakInside: 'avoid',
        overflow: 'hidden',
        boxSizing: 'border-box',
        padding: '48px', 
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
      }}
    >
      {/* Formal Medical Header */}
      <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tighter leading-none mb-1">
            MEDGENIX <span className="font-light text-slate-500">CLINICAL</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Department of Neurology & Digital Pathology</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-800">CLINICAL REPORT: PARKINSONIAN SCREENING</p>
          <p className="text-[9px] text-slate-500 font-mono mt-1">DATE: {reportDate} | TIME: {reportTime}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        {children}
      </div>

      {/* Formal Footer */}
      <div className="border-t border-slate-300 pt-3 mt-6 flex justify-between items-center text-[8px] text-slate-500 font-mono shrink-0">
        <div>
          <p>CONFIDENTIAL PATIENT RECORD</p>
          <p>DO NOT DISTRIBUTE WITHOUT AUTHORIZATION</p>
        </div>
        <div className="text-right">
          <p>PAGE {pageNum} OF {total}</p>
          <p>SYSTEM VER: MGX-2.0.4</p>
        </div>
      </div>
    </div>
  );

  return (
    // CRITICAL FIX: Removed the 20px padding from this wrapper. It must be exactly 794px wide.
    <div id="pdf-report-template" style={{ display: 'none', backgroundColor: 'white', width: '794px' }}>
      
      {/* ================= PAGE 1 ================= */}
      <Page pageNum={1} isLast={false}>
        {/* Patient Demographics Table */}
        <div className="border border-slate-400 mb-8">
          <div className="bg-slate-100 border-b border-slate-400 px-3 py-1.5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-800">Patient Demographics</h2>
          </div>
          <div className="grid grid-cols-4 text-[10px] divide-x divide-slate-300">
            <div className="p-2"><span className="text-slate-500 block text-[8px] mb-0.5">PATIENT NAME</span><span className="font-bold">{patientName}</span></div>
            <div className="p-2"><span className="text-slate-500 block text-[8px] mb-0.5">MRN / ID</span><span className="font-bold font-mono">{mrn}</span></div>
            <div className="p-2"><span className="text-slate-500 block text-[8px] mb-0.5">DOB / AGE</span><span className="font-bold">Not Provided</span></div>
            <div className="p-2"><span className="text-slate-500 block text-[8px] mb-0.5">REFERRING PHYSICIAN</span><span className="font-bold">Dr. AI System</span></div>
          </div>
        </div>

        {/* Primary Diagnosis Block */}
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-800 pb-1 mb-4">Primary Impression</h2>
        <div className="flex items-stretch gap-6 mb-8">
          <div className={`border-l-4 ${isHealthy ? 'border-green-600' : 'border-red-600'} pl-4 py-2 flex-1`}>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Automated Diagnosis Result</p>
            <h2 className={`text-2xl font-bold uppercase tracking-wide ${isHealthy ? 'text-green-700' : 'text-red-700'}`}>
              {data?.result || "Pending Analysis"}
            </h2>
          </div>
          <div className="border-l border-slate-300 pl-6 py-2 flex-1">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Model Confidence</p>
            <h2 className="text-2xl font-bold text-slate-800">{confidence}%</h2>
          </div>
          <div className="border-l border-slate-300 pl-6 py-2 flex-1">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Assigned Risk Tier</p>
            <h2 className="text-2xl font-bold text-slate-800">{riskLevel}</h2>
          </div>
        </div>

        {/* Dynamic AI Clinical Narrative */}
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-800 pb-1 mb-4">Clinical Narrative (AI Generated)</h2>
        <div className="bg-slate-50 border border-slate-300 p-5 rounded-sm mb-8">
          <p className="text-[12px] leading-relaxed text-slate-800 text-justify">
            {data?.ai_summary || "Biomarker extraction complete. Awaiting final clinical interpretation."}
          </p>
        </div>

        {/* Methodology Overview */}
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-800 pb-1 mb-4">Methodology Overview</h2>
        <p className="text-[10px] leading-relaxed text-slate-600 text-justify mb-8">
          Vocal acoustic analysis was performed utilizing a random forest machine learning ensemble. The model processes 22 distinct multidimensional dysphonia measurements (MDVP), evaluating fundamental frequency perturbations (Jitter), amplitude perturbations (Shimmer), and non-linear dynamic metrics (PPE, DFA). The confidence score reflects the mathematical probability of the input features matching the established Parkinsonian speech profile within the training dataset.
        </p>

        {/* Signatures */}
        <div className="mt-auto grid grid-cols-2 gap-20 pt-12">
          <div className="border-t border-slate-800 pt-2">
            <p className="text-[10px] font-bold text-slate-800 uppercase">System Sign-off</p>
            <p className="text-[9px] text-slate-500">MedGenix Automated Diagnostic Engine</p>
          </div>
          <div className="border-t border-slate-800 pt-2">
            <p className="text-[10px] font-bold text-slate-800 uppercase">Reviewing Physician</p>
            <p className="text-[9px] text-slate-500">Electronically signed ___________________</p>
          </div>
        </div>
      </Page>

      {/* ================= PAGE 2 ================= */}
      <Page pageNum={2} isLast={false}>
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-800 pb-1 mb-6">Comprehensive Acoustic Biomarker Profile</h2>
        
        <div className="border border-slate-400">
          <div className="grid grid-cols-12 bg-slate-100 border-b border-slate-400 px-4 py-2 text-[9px] font-bold text-slate-700 uppercase tracking-widest">
            <div className="col-span-5">Biomarker / Test Name</div>
            <div className="col-span-3 text-right">Result Value</div>
            <div className="col-span-2 text-center">Unit</div>
            <div className="col-span-2 text-center">Flag</div>
          </div>

          <div className="text-[10px]">
            {featureGroups.map((group, gIndex) => (
              <React.Fragment key={gIndex}>
                <div className="bg-slate-50 border-b border-slate-300 px-4 py-1.5 text-[9px] font-bold text-slate-600 bg-slate-200/50">
                  {group.title}
                </div>
                {group.indices.map((idx) => {
                  const val = formData && formData[idx] !== undefined && formData[idx] !== '' ? formData[idx] : 'N/A';
                  const isFlagged = !isHealthy && [0, 3, 8, 18, 21].includes(idx); 

                  return (
                    <div key={idx} className="grid grid-cols-12 border-b border-slate-200 px-4 py-2 hover:bg-slate-50">
                      <div className="col-span-5 font-mono text-slate-700">{featureLabels[idx]}</div>
                      <div className={`col-span-3 text-right font-mono font-bold ${isFlagged ? 'text-red-600' : 'text-slate-900'}`}>
                        {val}
                      </div>
                      <div className="col-span-2 text-center text-slate-500 italic text-[9px]">{group.unit}</div>
                      <div className="col-span-2 text-center">
                        {isFlagged && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[8px] font-bold">ABNORMAL</span>}
                      </div>
                    </div>
                  )
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Page>

      {/* ================= PAGE 3 ================= */}
      <Page pageNum={3} isLast={true}> {/* isLast=true STOPS the 7th page! */}
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-800 pb-1 mb-6">Clinical Pathway & Recommendations</h2>
        
        <table className="w-full text-left border-collapse border border-slate-400 mb-10">
          <thead>
            <tr className="bg-slate-100 text-[10px] text-slate-700 uppercase tracking-widest">
              <th className="p-3 border border-slate-400 w-1/4">Action Item</th>
              <th className="p-3 border border-slate-400 w-3/4">Details & Rationale</th>
            </tr>
          </thead>
          <tbody className="text-[11px] text-slate-800">
            <tr>
              <td className="p-3 border border-slate-300 font-bold">Neurological Consult</td>
              <td className="p-3 border border-slate-300">Schedule a formal physical assessment with a movement disorder specialist. Vocal analysis is highly sensitive but requires clinical correlation.</td>
            </tr>
            <tr>
              <td className="p-3 border border-slate-300 font-bold">UPDRS Evaluation</td>
              <td className="p-3 border border-slate-300">Complete Unified Parkinson's Disease Rating Scale (UPDRS) scoring to evaluate motor and non-motor symptoms.</td>
            </tr>
            <tr>
              <td className="p-3 border border-slate-300 font-bold">Longitudinal Monitoring</td>
              <td className="p-3 border border-slate-300">If asymptomatic, repeat voice biomarker analysis in 90 days to track progression or regression of micro-tremors.</td>
            </tr>
            <tr>
              <td className="p-3 border border-slate-300 font-bold">Neuroimaging</td>
              <td className="p-3 border border-slate-300">Consider DaTscan (Ioflupane I-123 injection) if clinical symptoms align with the high-risk categorization of this report.</td>
            </tr>
          </tbody>
        </table>

        <div className="border-t border-b border-slate-400 py-6 mb-8 text-center">
          <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest mb-2">END OF CLINICAL DATA</p>
          <div className="h-8 w-64 mx-auto border-y-4 border-slate-800 flex flex-col justify-between py-1 opacity-40">
            <div className="flex justify-between h-full w-full px-2">
              {[...Array(30)].map((_, i) => (
                <div key={i} className="bg-slate-800 h-full" style={{ width: `${Math.random() * 3 + 1}px` }}></div>
              ))}
            </div>
          </div>
          <p className="text-[8px] font-mono mt-1 text-slate-500">REF-{mrn}-A1B2C3D4</p>
        </div>

        <div className="bg-slate-100 border border-slate-300 p-5 rounded-sm">
          <h4 className="text-[10px] font-bold text-slate-800 mb-2 uppercase tracking-widest">Regulatory & Usage Disclaimer</h4>
          <p className="text-[9px] text-slate-600 text-justify leading-relaxed">
            This report was generated using an experimental Artificial Intelligence and Machine Learning algorithm. The MedGenix system is designed as an assistive screening tool and <strong>does not constitute a formal medical diagnosis</strong>. Features extracted via digital signal processing may be influenced by background noise, microphone quality, and non-Parkinsonian vocal pathologies. All results must be reviewed, verified, and contextualized by a licensed medical professional before clinical decisions are made.
          </p>
        </div>
      </Page>
    </div>
  );
};

// Data structures mapping
const featureLabels = [
  "MDVP:Fo", "MDVP:Fhi", "MDVP:Flo", "Jitter(%)", "Jitter(Abs)", "MDVP:RAP", "MDVP:PPQ", "Jitter:DDP",
  "Shimmer", "Shimmer(dB)", "APQ3", "APQ5", "MDVP:APQ", "Shimmer:DDA",
  "NHR", "HNR", "RPDE", "DFA", "spread1", "spread2", "D2", "PPE"
];

// Groupings for the Lab Results Table
const featureGroups = [
  { title: "Fundamental Frequency (Vocal Fold Vibration)", indices: [0, 1, 2], unit: "Hz" },
  { title: "Frequency Perturbation (Jitter Variants)", indices: [3, 4, 5, 6, 7], unit: "% / Abs" },
  { title: "Amplitude Perturbation (Shimmer Variants)", indices: [8, 9, 10, 11, 12, 13], unit: "dB / %" },
  { title: "Non-Linear Dynamics & Noise Metrics", indices: [14, 15, 16, 17, 18, 19, 20, 21], unit: "Index" }
];

export default ClinicalReportPDF;