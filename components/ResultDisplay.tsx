import React from 'react';
import { HeroData } from '../types';
import { Button } from './Button';
import { Download, RefreshCw, Share2, ArrowLeft } from 'lucide-react';

interface ResultDisplayProps {
  heroData: HeroData;
  generatedImage: string;
  onReset: () => void;
  onRegenerate: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  heroData, 
  generatedImage, 
  onReset,
  onRegenerate
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `${heroData.heroName.replace(/\s+/g, '_')}_poster.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center animate-fade-in">
      
      <div className="w-full bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-2xl overflow-hidden mb-8 relative group">
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-lg">
           <img 
            src={generatedImage} 
            alt="Generated Hero Scene" 
            className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
           />
           {/* Cinematic Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
           
           <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
             <p className="text-cyan-400 font-bold tracking-[0.3em] text-sm uppercase mb-2 brand-font">Coming Soon</p>
             <h1 className="text-4xl md:text-6xl font-black text-white brand-font tracking-tighter uppercase drop-shadow-2xl">
               {heroData.heroName}
             </h1>
             <p className="text-slate-300 mt-2 font-medium max-w-xl text-lg drop-shadow-md">
               A {heroData.theme} Original Movie
             </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
        <Button onClick={onReset} variant="secondary">
          <ArrowLeft size={18} />
          Start Over
        </Button>
        
        <Button onClick={onRegenerate} variant="outline">
          <RefreshCw size={18} />
          Regenerate
        </Button>
        
        <Button onClick={handleDownload} variant="primary">
          <Download size={18} />
          Download Poster
        </Button>
      </div>
    </div>
  );
};