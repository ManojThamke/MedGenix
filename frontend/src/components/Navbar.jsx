import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="hnav relative z-10 flex items-center justify-between px-12 py-5 border-b border-white/10">
      <div className="logo font-extrabold text-2xl font-['Syne']">
        Med<em className="text-[#a78bfa] not-italic">Genix</em>
        <span className="logo-dot inline-block w-2 h-2 rounded-full bg-[#7c5cfc] ml-1 animate-pulse"></span>
      </div>
      
      <div className="hnav-links hidden md:flex gap-7 text-[13px] text-[#6b7a99]">
        <a href="#" className="hover:text-white transition-colors">Home</a>
        <a href="#" className="hover:text-white transition-colors">Features</a>
        <a href="#" className="hover:text-white transition-colors">About</a>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => navigate('/login')}
          className="btn-o px-5 py-2 rounded-lg border border-white/20 text-[13px] font-medium hover:bg-[#111827] transition-all"
        >
          Sign In
        </button>
        <button 
          onClick={() => navigate('/login')}
          className="btn-p px-5 py-2 rounded-lg bg-[#7c5cfc] text-white text-[13px] font-semibold hover:bg-[#8b6dfd] shadow-[0_0_20px_rgba(124,92,252,0.35)] transition-all"
        >
          Get Started →
        </button>
      </div>
    </nav>
  );
}