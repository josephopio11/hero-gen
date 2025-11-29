import React, { useState } from 'react';
import { CameraCapture } from './CameraCapture';
import { Button } from './Button';
import { Upload, Camera as CameraIcon, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [mode, setMode] = useState<'select' | 'camera'>('select');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageSelected(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  if (mode === 'camera') {
    return (
      <CameraCapture 
        onCapture={(img) => onImageSelected(img)} 
        onCancel={() => setMode('select')} 
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-2xl p-8 text-center hover:border-cyan-500/50 transition-colors group">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute -inset-1 bg-cyan-500 rounded-full opacity-20 group-hover:opacity-40 blur transition-opacity"></div>
            <div className="relative bg-slate-900 p-4 rounded-full">
               <ImageIcon className="w-12 h-12 text-cyan-400" />
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 brand-font">Identify Target</h3>
        <p className="text-slate-400 mb-8 text-sm">Upload a clear photo of your face or take a selfie to begin the transformation.</p>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <Button fullWidth variant="primary" className="relative pointer-events-none">
              <Upload className="w-5 h-5" />
              Upload Photo
            </Button>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-slate-700"></div>
          </div>

          <Button fullWidth variant="outline" onClick={() => setMode('camera')}>
            <CameraIcon className="w-5 h-5" />
            Use Camera
          </Button>
        </div>
      </div>
      
      <div className="flex justify-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>Secure Processing</span>
        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>AI Enhanced</span>
      </div>
    </div>
  );
};