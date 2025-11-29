import React, { useState } from 'react';
import { Gender, HeroData } from '../types';
import { Button } from './Button';
import { User, Zap, Sparkles, Film } from 'lucide-react';

interface DetailsFormProps {
  initialImage: string;
  onSubmit: (data: Omit<HeroData, 'image'>) => void;
  onBack: () => void;
}

export const DetailsForm: React.FC<DetailsFormProps> = ({ initialImage, onSubmit, onBack }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [theme, setTheme] = useState('Sci-Fi Action');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ gender, heroName: name, theme });
    }
  };

  const themes = [
    'Sci-Fi Action', 'Dark Noir', 'Cyberpunk', 'Cosmic Space', 'Post-Apocalyptic'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start">
      
      {/* Preview Card */}
      <div className="w-full md:w-1/3 bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700">
        <div className="aspect-[3/4] relative">
          <img src={initialImage} alt="Source" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
             <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">Subject Identified</p>
             <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-full animate-pulse"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="w-full md:w-2/3 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white brand-font">Identity Configuration</h2>
          <p className="text-slate-400 text-sm">Define your superhero persona for the multiverse generation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <User size={16} className="text-cyan-400" />
              Gender Expression
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Male', 'Female', 'Non-binary'] as Gender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all border ${
                    gender === g 
                      ? 'bg-cyan-900/40 border-cyan-500 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Zap size={16} className="text-yellow-400" />
              Hero Alias
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. The Nightwatcher"
              required
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Film size={16} className="text-purple-400" />
              Movie Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {themes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`py-2 px-3 rounded-md text-xs font-medium transition-all border text-left truncate ${
                    theme === t
                      ? 'bg-purple-900/40 border-purple-500 text-purple-100'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <Button type="button" variant="secondary" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button type="submit" variant="primary" className="flex-[2]" disabled={!name}>
              <Sparkles className="w-5 h-5" />
              Generate Scene
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};