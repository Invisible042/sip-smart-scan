
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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center p-5 pb-4">
        <button
          onClick={handleBack}
          className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl font-bold">Scan Drink</h1>
      </div>

      {/* Camera Preview Area */}
      <div className="flex-1 px-5 mb-6">
        <div className="h-full bg-slate-800 rounded-3xl border-2 border-dashed border-slate-600 flex items-center justify-center">
          {isScanning ? (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 animate-pulse">
                <div className="w-full h-full bg-gradient-to-r from-teal-500 to-yellow-400 rounded-full flex items-center justify-center">
                  <div className="text-white text-3xl">🔍</div>
                </div>
              </div>
              <p className="text-slate-300 font-medium text-lg">Analyzing drink...</p>
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-700 rounded-full flex items-center justify-center">
                <Camera className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-sm">
                Snap or upload a drink label to instantly see calories, sugar, and more.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-12 pb-8 px-5">
        <button
          onClick={handleUploadClick}
          disabled={isScanning}
          className="flex flex-col items-center space-y-2 disabled:opacity-50"
        >
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-600">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <span className="text-slate-300 font-medium text-sm">Upload</span>
        </button>

        <button
          onClick={handleCameraClick}
          disabled={isScanning}
          className="w-20 h-20 border-4 border-white rounded-full disabled:opacity-50 flex items-center justify-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-yellow-400 rounded-full"></div>
        </button>

        <button
          onClick={handleCameraClick}
          disabled={isScanning}
          className="flex flex-col items-center space-y-2 disabled:opacity-50"
        >
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-600">
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
  );
};
