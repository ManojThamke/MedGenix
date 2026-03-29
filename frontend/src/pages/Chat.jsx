import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { chat } from '../services/api';

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  // 1. Extract Report Context passed from Dashboard/Reports
  const reportContext = location.state?.reportContext || null;

  // 2. Language State (Defaults to English)
  const [language, setLanguage] = useState('English');

  // 3. Auto-Generate Doctor's Initial Assessment based on Data
  const getInitialGreeting = () => {
    if (reportContext) {
      const isDetected = reportContext.result?.toLowerCase().includes('detected') || reportContext.risk === 'HIGH';
      
      if (isDetected) {
        return `Hello. I am Dr. MedGenix. I have reviewed your clinical report indicating a **${reportContext.risk} risk** of Parkinson's with **${reportContext.confidence}% confidence**.\n\nBased on your acoustic biomarkers, the model identified irregularities such as pitch instability (PPE) and non-linear variation, which correlate with early neuromuscular changes.\n\n*Please remember this is a screening analysis, not a definitive diagnosis.* I recommend consulting a neurologist for a formal UPDRS clinical assessment.\n\nWhat specific questions do you have about these results or your recommended next steps?`;
      } else {
        return `Hello. I am Dr. MedGenix. I have reviewed your clinical report, and your results indicate you are **Healthy** (${reportContext.confidence}% confidence).\n\nYour vocal biomarkers (such as pitch stability and amplitude variation) fall within normal physiological ranges. The model did not detect significant acoustic indicators of neuromuscular degeneration.\n\nDo you have any questions regarding how this analysis was performed?`;
      }
    }
    return "Hello! I am Dr. MedGenix, your Clinical AI Assistant. I can explain your voice biomarker reports, answer questions regarding Parkinson's disease, and guide you on clinical next steps.\n\nHow can I assist you today?";
  };

  // --- State Management ---
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      text: getInitialGreeting(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- Send Message Handler ---
  const handleSend = async (text = inputValue) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    // 1. Update UI with User Message
    const newUserMsg = {
      id: Date.now(),
      role: 'user',
      text: trimmedText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // 2. Inject Context Silently for the Backend
    let promptToSend = trimmedText;
    if (reportContext && messages.length === 1) {
      promptToSend = `The patient is asking about their specific report data: Result=${reportContext.result}, Confidence=${reportContext.confidence}%, Risk=${reportContext.risk}. Patient Question: "${trimmedText}"`;
    }

    try {
      // 3. Call Backend API with the prompt AND the selected language
      const response = await chat(promptToSend, language);
      
      const newAiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: response.reply || "I encountered an error processing your request.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newAiMsg]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: "⚠️ *System Alert:* Unable to connect to the MedGenix inference server.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // Helper to render Markdown bold text and newlines
  const renderFormattedText = (text) => {
    return text.split('\n').map((line, lineIndex) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <React.Fragment key={lineIndex}>
          {parts.map((part, i) => 
            part.startsWith('**') && part.endsWith('**') 
              ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong> 
              : part
          )}
          {lineIndex < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="h-screen bg-[#060810] text-[#f0f4ff] font-['Space_Grotesk'] flex flex-col overflow-hidden">
      
      {/* TOPBAR */}
      <div className="bg-[#0c0f1a] border-b border-white/5 px-6 py-3.5 flex items-center justify-between shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c5cfc] to-[#f472b6] flex items-center justify-center text-[20px] shadow-sm shrink-0">🧠</div>
          <div>
            <div className="text-[15px] font-bold text-white font-['Syne'] tracking-tight">MedGenix Clinical AI</div>
            <div className="text-[12px] text-[#6b7a99] mt-0.5 tracking-wide">Diagnostic Explanation & Medical Guidance</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          
          {/* LANGUAGE SELECTOR */}
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#111827] border border-white/10 text-[12px] text-[#a78bfa] rounded-lg px-3 py-1.5 outline-none focus:border-[#7c5cfc]/50 cursor-pointer shadow-sm transition-all"
          >
            <option value="English">🇬🇧 English</option>
            <option value="Spanish">🇪🇸 Spanish</option>
            <option value="French">🇫🇷 French</option>
            <option value="Hindi">🇮🇳 Hindi</option>
            <option value="Marathi">🇮🇳 Marathi</option>
          </select>

          <div className="hidden md:flex items-center gap-2 text-[12px] text-[#4ade80] font-mono tracking-wide bg-[#4ade80]/10 px-3 py-1.5 rounded-full border border-[#4ade80]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80] animate-pulse"></span>
            Dr. AI Online
          </div>
          <div className="w-px h-5 bg-white/10 mx-1 hidden md:block"></div>
          <button className="text-[13px] font-medium px-3.5 py-1.5 rounded-lg bg-[#111827] border border-white/5 text-[#6b7a99] hover:border-white/15 hover:text-white transition-all" onClick={() => navigate('/dash')}>← Dashboard</button>
        </div>
      </div>

      {/* CONTEXT BANNER */}
      {reportContext && (
        <div className="mx-6 mt-4 bg-[#22d3ee]/10 border border-[#22d3ee]/30 rounded-xl p-3 px-4 flex items-center justify-between gap-4 shadow-sm shrink-0">
          <div className="text-[12px] text-[#22d3ee] font-mono leading-relaxed">
            <span className="mr-1.5">🔗</span> <strong>Clinical Context Linked:</strong> Assistant is analyzing report predicting <span className="text-white">[{reportContext.result}]</span> at <span className="text-white">[{reportContext.confidence}%]</span> confidence.
          </div>
        </div>
      )}

      {/* CHAT WINDOW */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 scroll-smooth custom-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-[14px] ${isUser ? 'bg-[#1a2035] border border-white/10 font-bold text-white' : 'bg-gradient-to-br from-[#7c5cfc] to-[#f472b6] shadow-sm'}`}>
                {isUser ? 'PT' : '🧠'}
              </div>
              <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-3.5 text-[14px] leading-[1.7] shadow-sm ${
                  isUser 
                    ? 'bg-[#7c5cfc] text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm' 
                    : 'bg-[#111827] border border-white/5 text-[#d1d5db] rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm'
                }`}>
                  {renderFormattedText(msg.text)}
                </div>
                <div className="text-[11px] text-[#6b7a99] mt-1.5 font-mono">{msg.time}</div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-[14px] bg-gradient-to-br from-[#7c5cfc] to-[#f472b6] shadow-sm">🧠</div>
            <div className="px-4 py-3.5 bg-[#111827] border border-white/5 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm flex items-center gap-1.5 shadow-sm w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6b7a99] animate-[typ_1s_ease-in-out_infinite]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#6b7a99] animate-[typ_1s_ease-in-out_0.2s_infinite]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#6b7a99] animate-[typ_1s_ease-in-out_0.4s_infinite]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* SUGGESTION CHIPS */}
      <div className="flex gap-2.5 overflow-x-auto px-6 pb-4 scrollbar-hide shrink-0">
        {[
          "What exactly does HIGH risk mean?",
          "Can you explain Jitter and Shimmer?",
          "What is a UPDRS assessment?",
          "What are the next steps I should take?"
        ].map((chip, idx) => (
          <button 
            key={idx} 
            className="px-4 py-2 rounded-full bg-[#111827] border border-white/10 text-[13px] font-medium text-[#a78bfa] hover:bg-[#7c5cfc]/15 hover:border-[#7c5cfc]/40 hover:text-white transition-all whitespace-nowrap shrink-0"
            onClick={() => handleSend(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* INPUT BAR */}
      <div className="bg-[#0c0f1a] border-t border-white/5 p-4 md:px-6 flex items-center gap-3 shrink-0 z-20">
        <input 
          className="flex-1 bg-[#111827] border border-white/10 rounded-xl px-4 py-3.5 text-white text-[14px] font-['Space_Grotesk'] outline-none transition-all placeholder:text-[#6b7a99] focus:border-[#7c5cfc]/60 focus:bg-[#0c0f1a] shadow-inner"
          placeholder="Ask Dr. MedGenix a medical question..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
        />
        <button 
          className="w-[50px] h-[50px] rounded-xl bg-[#7c5cfc] border-none cursor-pointer flex items-center justify-center text-white text-[20px] transition-all hover:bg-[#8b6dfd] hover:shadow-[0_4px_15px_rgba(124,92,252,0.4)] hover:-translate-y-[1px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || isTyping}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes typ {
          0%, 100% { transform: scale(0.7); opacity: 0.4; }
          50% { transform: scale(1); opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a2035; border-radius: 4px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
}