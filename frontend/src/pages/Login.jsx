import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../services/api'; 
import { useGoogleLogin } from "@react-oauth/google"; // FIXED IMPORT
import { jwtDecode } from "jwt-decode";
import { googleLogin } from "../services/api";

export default function Login() {
    const navigate = useNavigate();

    // UI & Form State
    const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState(''); // Optional for signup
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // ✅ Basic validation
            if (!email || !password) {
                alert("Please fill all fields");
                return;
            }

            let res;

            // ---------------- SIGNUP ----------------
            if (mode === "signup") {
                console.log("🔵 Signup start");
                const signupRes = await signup({ email, password });
                console.log("✅ Signup response:", signupRes);

                if (signupRes?.error) {
                    alert(signupRes.error);
                    return;
                }
            }

            // ---------------- LOGIN ----------------
            console.log("🔵 Login start");
            res = await login({ email, password });
            console.log("✅ Login response:", res);

            // ❌ Handle backend error
            if (!res || res.error || !res.access_token) {
                alert(res?.error || "Login failed");
                return;
            }

            // ---------------- SAVE TOKEN ----------------
            localStorage.setItem("token", res.access_token);
            console.log("🟢 Token saved");

            // ---------------- NAVIGATE ----------------
            // 🔥 FIXED: Navigating to '/dash' to match App.jsx
            navigate("/dash"); 

        } catch (err) {
            console.error("❌ FULL ERROR:", err);

            const errorMsg =
                err.response?.data?.detail ||
                err.message ||
                "Authentication failed. Please check your credentials.";

            alert(errorMsg);

        } finally {
            setLoading(false);
        }
    };

    const googleAuth = useGoogleLogin({
        flow: "implicit",
        onSuccess: async (tokenResponse) => {
            try {
                const userInfo = await fetch(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`,
                        },
                    }
                );

                const user = await userInfo.json();
                const res = await googleLogin(user.email);
                localStorage.setItem("token", res.access_token);

                // 🔥 FIXED: Navigating to '/dash' to match App.jsx
                navigate("/dash");

            } catch (err) {
                console.error(err);
                alert("Google login failed");
            }
        },
        onError: () => {
            console.log("Google Login Failed");
        },
    });

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

            {/* LEFT PANEL: Brand & Features */}
            <div className="hidden lg:flex flex-col justify-center flex-1 px-16 py-12 max-w-[520px] relative z-10 border-r border-white/5 bg-black/10 backdrop-blur-sm">
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
                    {[
                        { icon: "🎙️", title: "Voice Recording", desc: "Auto-extract 22 biomarkers via Parselmouth" },
                        { icon: "🧠", title: "AI Clinical Insight", desc: "Gemini AI explains predictions in clinical language" },
                        { icon: "📄", title: "PDF Reports", desc: "Professional clinical reports downloadable anytime" },
                        { icon: "🗄️", title: "Report History", desc: "All predictions stored and easily searchable" }
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-lg group-hover:border-[#7c5cfc]/50 transition-all">
                                {feature.icon}
                            </div>
                            <div className="text-[13px] text-[#6b7a99] leading-snug">
                                <strong className="text-white font-semibold block mb-0.5 text-[14px]">{feature.title}</strong>
                                {feature.desc}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT PANEL: Auth Form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
                <div className="w-full max-w-[420px] bg-[#0c0f1a]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">

                    <div className="font-['Syne'] text-[24px] font-extrabold text-white mb-1">
                        {mode === 'signin' ? 'Welcome back' : 'Create account'}
                    </div>
                    <div className="text-[13px] text-[#6b7a99] mb-8">
                        {mode === 'signin' ? 'Sign in to your clinical dashboard' : 'Join the MedGenix network today'}
                    </div>

                    {/* TABS */}
                    <div className="flex bg-black/40 rounded-2xl p-1 gap-1 mb-8 border border-white/5">
                        <button
                            onClick={() => setMode('signin')}
                            className={`flex-1 text-center py-2.5 rounded-xl text-[12px] font-bold transition-all ${mode === 'signin' ? 'bg-[#7c5cfc] text-white shadow-lg' : 'text-[#6b7a99] hover:text-white'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setMode('signup')}
                            className={`flex-1 text-center py-2.5 rounded-xl text-[12px] font-bold transition-all ${mode === 'signup' ? 'bg-[#7c5cfc] text-white shadow-lg' : 'text-[#6b7a99] hover:text-white'
                                }`}
                        >
                            Create Account
                        </button>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleAuth} className="flex flex-col gap-5">

                        {mode === 'signup' && (
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-[#6b7a99] ml-1">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Dr. Jane Smith"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-[14px] outline-none focus:border-[#7c5cfc]/50 focus:bg-[#7c5cfc]/5 transition-all"
                                />
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#6b7a99] ml-1">Email Address</label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="doctor@hospital.com"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-[14px] outline-none focus:border-[#7c5cfc]/50 focus:bg-[#7c5cfc]/5 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-[#6b7a99] ml-1">Password</label>
                            <input
                                required
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-[14px] outline-none focus:border-[#7c5cfc]/50 focus:bg-[#7c5cfc]/5 transition-all"
                            />
                        </div>

                        {mode === 'signin' && (
                            <div className="flex items-center justify-between px-1">
                                <label className="flex items-center gap-2 text-[12px] text-[#6b7a99] cursor-pointer hover:text-white transition-colors">
                                    <input type="checkbox" className="accent-[#7c5cfc] w-3.5 h-3.5" />
                                    Remember me
                                </label>
                                <button type="button" className="text-[12px] text-[#a78bfa] hover:underline">Forgot password?</button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-2 rounded-2xl bg-[#7c5cfc] text-white text-[14px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(124,92,252,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:transform-none"
                        >
                            {loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In to Dashboard' : 'Register Account'}
                        </button>

                        <div className="flex items-center gap-3 my-2 text-[11px] text-[#2a3550] uppercase font-black tracking-widest">
                            <div className="flex-1 h-px bg-white/5"></div>
                            or
                            <div className="flex-1 h-px bg-white/5"></div>
                        </div>

                        <button
                            type="button"
                            onClick={() => googleAuth()}
                            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-[13px] font-bold hover:bg-white/10 transition-all"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </form>

                    <div className="text-center text-[10px] text-[#6b7a99] font-mono mt-8 uppercase tracking-widest opacity-50">
                        MedGenix Secure Auth Protocol v2.4
                    </div>
                </div>
            </div>
        </div>
    );
}