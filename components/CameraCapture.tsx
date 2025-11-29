import React, { useRef, useState, useCallback } from 'react';
import { Button } from './Button';
import { Camera, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      setError("Unable to access camera. Please allow permissions.");
      console.error(err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Flip horizontally for mirror effect if using front camera usually
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        stopCamera();
        onCapture(dataUrl);
      }
    }
  }, [onCapture, stopCamera]);

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-lg p-6 border border-red-500/30">
        <XCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-200 mb-4 text-center">{error}</p>
        <Button onClick={onCancel} variant="secondary">Close</Button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      <div className="relative aspect-[3/4] md:aspect-video bg-black">
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover transform -scale-x-100" 
          muted 
          playsInline
        />
        {/* Face guide overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-50">
           <div className="w-48 h-64 border-2 border-cyan-500/50 rounded-[50%] border-dashed"></div>
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="p-4 bg-slate-900 flex justify-between items-center border-t border-slate-800">
        <button 
          onClick={onCancel} 
          className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <XCircle size={24} />
        </button>
        
        <button 
          onClick={capturePhoto}
          className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.6)] transition-all transform hover:scale-105"
        >
          <Camera size={32} className="text-white" />
        </button>
        
        <button 
          onClick={() => { stopCamera(); startCamera(); }} 
          className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw size={24} />
        </button>
      </div>
    </div>
  );
};