import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'

  const handleAuth = async (e) => {
  e.preventDefault();

  try {
    let res;

    if (mode === "signin") {
      res = await login({ email, password });
    } else {
      await signup({ email, password });
      res = await login({ email, password });
    }

    // SAVE TOKEN
    localStorage.setItem("token", res.access_token);

    navigate("/dashboard");

  } catch (err) {
    alert("Auth failed");
  }
};

  return (
    <div className="min-h-screen bg-[#060810] text-[#f0f4ff] flex relative overflow-hidden font-['Space_Grotesk']">
      {/* Background Gradients */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(124,92,252,.14) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 30%, rgba(244,114,182,.09) 0%, transparent 55%)
          `
        }}
      ></div>

      {/* LEFT PANEL: Brand & Features (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-center flex-1 px-16 py-12 max-w-[520px] relative z-10">
        <div className="mb-12">
          <div className="font-['Syne'] text-3xl font-extrabold text-white">
            Med<em className="text-[#a78bfa] not-italic">Genix</em>
            <span className="inline-block w-2 h-2 rounded-full bg-[#7c5cfc] ml-1 animate-pulse"></span>
          </div>
          <div className="text-[13px] text-[#6b7a99] mt-2 leading-relaxed max-w-[320px]">
            AI-powered Parkinson's Disease Detection — Machine Learning + Generative AI + Voice Analysis
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center shrink-0 text-lg">🎙️</div>
            <div className="text-[13px] text-[#6b7a99] leading-snug">
              <strong className="text-white font-semibold block mb-0.5 text-[14px]">Voice Recording</strong>
              Record voice → auto-extract 22 biomarkers via Parselmouth
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7c5cfc]/10 border border-[#7c5cfc]/30 flex items-center justify-center shrink-0 text-lg">🧠</div>
            <div className="text-[13px] text-[#6b7a99] leading-snug">
              <strong className="text-white font-semibold block mb-0.5 text-[14px]">AI Clinical Insight</strong>
              Gemini AI explains every prediction in plain clinical language
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4ade80]/10 border border-[#4ade80]/30 flex items-center justify-center shrink-0 text-lg">📄</div>
            <div className="text-[13px] text-[#6b7a99] leading-snug">
              <strong className="text-white font-semibold block mb-0.5 text-[14px]">PDF Reports</strong>
              Professional clinical reports with AI narrative, downloadable anytime
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f472b6]/10 border border-[#f472b6]/30 flex items-center justify-center shrink-0 text-lg">🗄️</div>
            <div className="text-[13px] text-[#6b7a99] leading-snug">
              <strong className="text-white font-semibold block mb-0.5 text-[14px]">Report History</strong>
              All predictions stored in MongoDB — view, filter, and re-download
            </div>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="hidden lg:block w-px bg-white/10 relative z-10 shrink-0"></div>

      {/* RIGHT PANEL: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-[400px] bg-[#0c0f1a] border border-white/10 rounded-[22px] p-8">
          
          <div className="font-['Syne'] text-[22px] font-extrabold text-white mb-1">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </div>
          <div className="text-[13px] text-[#6b7a99] mb-6">
            {mode === 'signin' ? 'Sign in to your clinical dashboard' : 'Join MedGenix today'}
          </div>

          {/* TABS */}
          <div className="flex bg-[#111827] rounded-xl p-1 gap-1 mb-6">
            <button 
              onClick={() => setMode('signin')}
              className={`flex-1 text-center py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                mode === 'signin' ? 'bg-[#1a2035] text-white shadow' : 'text-[#6b7a99] hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 text-center py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                mode === 'signup' ? 'bg-[#1a2035] text-white shadow' : 'text-[#6b7a99] hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleAuth} className="flex flex-col gap-4">
            
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-[#6b7a99] mb-1.5 uppercase tracking-wider font-mono">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Dr. Jane Smith" 
                  className="w-full px-3.5 py-2.5 bg-[#111827] border border-white/10 rounded-xl text-white text-[14px] outline-none focus:border-[#7c5cfc] focus:ring-2 focus:ring-[#7c5cfc]/10 transition-all placeholder:text-[#2a3550]"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-[#6b7a99] mb-1.5 uppercase tracking-wider font-mono">Email Address</label>
              <input 
                type="email" 
                placeholder="doctor@hospital.com" 
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-white/10 rounded-xl text-white text-[14px] outline-none focus:border-[#7c5cfc] focus:ring-2 focus:ring-[#7c5cfc]/10 transition-all placeholder:text-[#2a3550]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6b7a99] mb-1.5 uppercase tracking-wider font-mono">Password</label>
              <input 
                type="password" 
                placeholder={mode === 'signin' ? "••••••••" : "Min. 8 characters"} 
                className="w-full px-3.5 py-2.5 bg-[#111827] border border-white/10 rounded-xl text-white text-[14px] outline-none focus:border-[#7c5cfc] focus:ring-2 focus:ring-[#7c5cfc]/10 transition-all placeholder:text-[#2a3550]"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-[#6b7a99] mb-1.5 uppercase tracking-wider font-mono">Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="Repeat password" 
                  className="w-full px-3.5 py-2.5 bg-[#111827] border border-white/10 rounded-xl text-white text-[14px] outline-none focus:border-[#7c5cfc] focus:ring-2 focus:ring-[#7c5cfc]/10 transition-all placeholder:text-[#2a3550]"
                />
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex items-center justify-between mt-1 mb-2">
                <label className="flex items-center gap-2 text-[12px] text-[#6b7a99] cursor-pointer hover:text-white transition-colors">
                  <input type="checkbox" className="accent-[#7c5cfc] w-3.5 h-3.5 rounded border-white/10" /> 
                  Remember me
                </label>
                <a href="#" className="text-[12px] text-[#a78bfa] hover:text-[#7c5cfc] transition-colors">Forgot password?</a>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3 mt-2 rounded-xl bg-[#7c5cfc] text-white text-[14px] font-bold shadow-[0_0_22px_rgba(124,92,252,.38)] hover:bg-[#8b6dfd] hover:shadow-[0_0_30px_rgba(124,92,252,.55)] transition-all"
            >
              {mode === 'signin' ? 'Sign In to Dashboard' : 'Create Account'}
            </button>

            <div className="text-center text-[11px] text-[#6b7a99] font-mono mt-1">
              Demo mode — any credentials accepted
            </div>
            
            <div className="flex items-center gap-3 my-2 text-[12px] text-[#2a3550]">
              <div className="flex-1 h-px bg-white/10"></div>
              or continue with
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <button 
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#111827] border border-white/10 text-white text-[13px] font-semibold hover:bg-[#1a2035] hover:border-white/20 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}