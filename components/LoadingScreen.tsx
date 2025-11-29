import React, { useEffect, useState } from 'react';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing Neural Uplink...");

  useEffect(() => {
    const messages = [
      "Analyzing facial structure...",
      "Designing super suit...",
      "Rendering cinematic lighting...",
      "Applying special effects...",
      "Finalizing composite..."
    ];
    
    let currentMsg = 0;
    const msgInterval = setInterval(() => {
      currentMsg = (currentMsg + 1) % messages.length;
      setStatus(messages[currentMsg]);
    }, 2500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95; // Hold at 95 until done
        return prev + 0.5;
      });
    }, 100);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto text-center space-y-8 py-12">
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
        <div className="absolute inset-4 rounded-full border-4 border-purple-500/50 border-b-transparent animate-[spin_3s_linear_infinite_reverse]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold brand-font text-white">{Math.floor(progress)}%</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white brand-font animate-pulse">{status}</h3>
        <p className="text-slate-500 text-sm">Powered by Gemini 2.5 Image Generation</p>
      </div>

      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};