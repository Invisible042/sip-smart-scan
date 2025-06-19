
import { useState, useRef } from "react";
import { Camera, Upload, ArrowLeft } from "lucide-react";
import { useDrink } from "@/contexts/DrinkContext";
import { analyzeDrink } from "@/services/drinkAnalysis";
import { toast } from "sonner";

interface CameraCaptureProps {
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
}

export const CameraCapture = ({ isScanning, setIsScanning }: CameraCaptureProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addDrink } = useDrink();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    
    try {
      const drinkData = await analyzeDrink(file);
      addDrink(drinkData);
      toast.success(`${drinkData.name} logged successfully!`);
    } catch (error) {
      console.error('Error analyzing drink:', error);
      toast.error('Failed to analyze drink. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleBack = () => {
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-sm mx-auto bg-slate-900 min-h-screen relative">
        {/* Status Bar */}
        <div className="flex justify-between items-center pt-3 px-5 pb-2 text-white text-sm font-semibold">
          <div>9:41</div>
          <div className="flex gap-1 items-center">
            <span>••••</span>
            <span>📶</span>
            <div className="w-6 h-3 border border-white rounded-sm relative">
              <div className="w-4/5 h-full bg-green-400 rounded-sm"></div>
              <div className="absolute -right-1 top-1 w-1 h-1 bg-white rounded-r"></div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center pt-6 px-6 pb-6">
          <button
            onClick={handleBack}
            className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4 border border-white/20"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Scan Drink</h1>
        </div>

        {/* Camera Preview Area - Made much larger */}
        <div className="px-6 mb-8">
          <div className="h-96 bg-white/5 rounded-3xl border-2 border-dashed border-white/20 flex items-center justify-center backdrop-blur-sm">
            {isScanning ? (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 animate-pulse">
                  <div className="w-full h-full bg-gradient-to-r from-teal-500 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <div className="text-white text-4xl">🔍</div>
                  </div>
                </div>
                <p className="text-white font-semibold text-xl mb-2">Analyzing drink...</p>
                <p className="text-slate-300 text-sm">Please wait while we process your image</p>
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="w-28 h-28 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-sm">
                  <Camera className="w-14 h-14 text-white" />
                </div>
                <h3 className="text-white text-2xl font-bold mb-3">Snap & Analyze</h3>
                <p className="text-slate-300 text-lg font-medium leading-relaxed max-w-sm mx-auto">
                  Take a photo or upload an image of your drink to instantly discover calories, sugar, caffeine, and nutritional information.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-12 pb-8 px-6">
          <button
            onClick={handleUploadClick}
            disabled={isScanning}
            className="flex flex-col items-center space-y-3 disabled:opacity-50 transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <span className="text-slate-300 font-medium text-sm">Upload</span>
          </button>

          <button
            onClick={handleCameraClick}
            disabled={isScanning}
            className="w-20 h-20 border-4 border-white rounded-full disabled:opacity-50 flex items-center justify-center transition-all hover:scale-105 shadow-lg"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-yellow-400 rounded-full"></div>
          </button>

          <button
            onClick={handleCameraClick}
            disabled={isScanning}
            className="flex flex-col items-center space-y-3 disabled:opacity-50 transition-all hover:scale-105"
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <span className="text-slate-300 font-medium text-sm">Camera</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};
