import React, { useState } from 'react';
import { AppStep, HeroData } from './types';
import { generateSuperheroScene } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { DetailsForm } from './components/DetailsForm';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultDisplay } from './components/ResultDisplay';
import { Aperture } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [heroData, setHeroData] = useState<HeroData>({
    image: null,
    gender: 'Male',
    heroName: '',
    theme: 'Sci-Fi Action'
  });
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (base64: string) => {
    setHeroData(prev => ({ ...prev, image: base64 }));
    setStep(AppStep.DETAILS);
  };

  const handleDetailsSubmit = async (data: Omit<HeroData, 'image'>) => {
    const updatedData = { ...heroData, ...data };
    setHeroData(updatedData);
    setStep(AppStep.GENERATING);
    setError(null);

    try {
      if (!updatedData.image) throw new Error("Image missing");
      
      const resultImg = await generateSuperheroScene(
        updatedData.image, 
        updatedData.gender, 
        updatedData.heroName,
        updatedData.theme
      );
      
      setGeneratedImage(resultImg);
      setStep(AppStep.RESULT);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate scene. Please try again. Make sure your API key is valid.");
      setStep(AppStep.DETAILS);
    }
  };

  const handleRegenerate = () => {
    handleDetailsSubmit({
      gender: heroData.gender,
      heroName: heroData.heroName,
      theme: heroData.theme
    });
  };

  const handleReset = () => {
    setHeroData({
      image: null,
      gender: 'Male',
      heroName: '',
      theme: 'Sci-Fi Action'
    });
    setGeneratedImage(null);
    setStep(AppStep.UPLOAD);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-2 rounded-lg">
               <Aperture className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white brand-font">
              HERO<span className="text-cyan-400">GEN</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
             <span className={step === AppStep.UPLOAD ? "text-cyan-400" : ""}>1. Scan</span>
             <span className="w-4 h-px bg-slate-700"></span>
             <span className={step === AppStep.DETAILS ? "text-cyan-400" : ""}>2. Identity</span>
             <span className="w-4 h-px bg-slate-700"></span>
             <span className={step === AppStep.RESULT ? "text-cyan-400" : ""}>3. Premiere</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-12 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        
        {step === AppStep.UPLOAD && (
          <div className="w-full animate-fade-in-up">
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-white brand-font leading-tight">
                Enter the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  Cinematic Multiverse
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Upload your photo to generate a high-fidelity superhero movie scene starring you. Powered by Gemini AI.
              </p>
            </div>
            <ImageUploader onImageSelected={handleImageSelect} />
          </div>
        )}

        {step === AppStep.DETAILS && heroData.image && (
          <DetailsForm 
            initialImage={heroData.image} 
            onSubmit={handleDetailsSubmit}
            onBack={() => setStep(AppStep.UPLOAD)}
          />
        )}

        {step === AppStep.GENERATING && (
          <LoadingScreen />
        )}

        {step === AppStep.RESULT && generatedImage && (
          <ResultDisplay 
            heroData={heroData} 
            generatedImage={generatedImage} 
            onReset={handleReset}
            onRegenerate={handleRegenerate}
          />
        )}

        {/* Error Toast */}
        {error && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-900/90 text-white px-6 py-4 rounded-lg border border-red-500 shadow-2xl z-50 animate-bounce-in">
             <p className="font-bold">Error</p>
             <p className="text-sm opacity-90">{error}</p>
             <button 
               onClick={() => setError(null)} 
               className="absolute top-2 right-2 text-red-200 hover:text-white"
             >
               ×
             </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-slate-900 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} HeroGen AI. Built with Gemini 2.5 Flash Image.</p>
      </footer>
    </div>
  );
};

export default App;