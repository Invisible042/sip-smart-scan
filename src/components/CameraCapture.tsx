
import { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";
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
    // For now, trigger file input - can be enhanced with camera API later
    fileInputRef.current?.click();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Camera Preview Area */}
      <div className="w-full max-w-sm mx-auto mb-8">
        <div className="aspect-square bg-gray-soft rounded-3xl border-2 border-dashed border-gray-300 flex items-center justify-center">
          {isScanning ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 animate-pulse-subtle">
                <div className="w-full h-full bg-orange-brand rounded-full flex items-center justify-center">
                  <div className="text-white text-2xl">🔍</div>
                </div>
              </div>
              <p className="text-gray-600 font-medium">Analyzing drink...</p>
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                <Camera className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                Snap or upload a drink label to instantly see calories, sugar, and more.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-8">
        <button
          onClick={handleUploadClick}
          disabled={isScanning}
          className="flex flex-col items-center space-y-2 disabled:opacity-50"
        >
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <span className="text-gray-700 font-medium">Upload</span>
        </button>

        <button
          onClick={handleCameraClick}
          disabled={isScanning}
          className="w-20 h-20 border-4 border-gray-900 rounded-full disabled:opacity-50"
        />

        <button
          onClick={handleCameraClick}
          disabled={isScanning}
          className="flex flex-col items-center space-y-2 disabled:opacity-50"
        >
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
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
