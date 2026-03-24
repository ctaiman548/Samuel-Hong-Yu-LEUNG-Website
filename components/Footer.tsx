import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = "hongyuleung1216@gmail.com";

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-auto lg:h-full min-h-fit lg:min-h-[100dvh] flex flex-col justify-end items-start bg-black/40 backdrop-blur-md px-12 md:px-24 pb-24 pt-32 border-t lg:border-t-0 lg:border-l border-white/20 relative z-20 text-white">
      <div className="w-full flex flex-col items-start text-left">
        <div className="flex flex-col items-start gap-4 w-full">
          {/* Email */}
          <div className="flex items-center gap-3 group">
            <span className="text-sm font-light tracking-wide">
              {email}
            </span>
            <button 
              onClick={handleCopy}
              className="text-white/70 hover:text-white transition-colors duration-300 focus:outline-none flex items-center justify-center"
              title="Copy email address"
            >
              {copied ? <Check size={16} strokeWidth={2} className="text-green-400" /> : <Copy size={16} strokeWidth={1.5} />}
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.2em] font-medium">
            <a 
              href="https://youtube.com/@samuelhong-yuleung?si=d_nBLi14ttB6p7r6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-[3px] border border-white hover:bg-white hover:text-black transition-colors duration-200 ease-in-out whitespace-nowrap cursor-pointer text-white"
            >
              YouTube
            </a>

            <a 
              href="https://soundcloud.com/hong-yu-leung" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-[3px] border border-white hover:bg-white hover:text-black transition-colors duration-200 ease-in-out whitespace-nowrap cursor-pointer text-white"
            >
              SoundCloud
            </a>

            <a 
              href="https://www.instagram.com/samuel_leung1216/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-[3px] border border-white hover:bg-white hover:text-black transition-colors duration-200 ease-in-out whitespace-nowrap cursor-pointer text-white"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/20 w-full flex flex-col items-start gap-2">
          <p className="text-xs uppercase tracking-widest text-white/60">
            © {new Date().getFullYear()} Samuel Hong-Yu LEUNG
          </p>
          <p className="text-[10px] uppercase tracking-widest text-white/40">
            All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
