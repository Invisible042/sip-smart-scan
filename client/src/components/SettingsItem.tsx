
interface SettingsItemProps {
  icon: string;
  title: string;
  hasArrow?: boolean;
}

export const SettingsItem = ({ icon, title, hasArrow = false }: SettingsItemProps) => {
  return (
    <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 flex items-center justify-center">
          <span className="text-xl">{icon}</span>
        </div>
        <span className="text-lg font-medium text-white">{title}</span>
      </div>
      
      {hasArrow && (
        <div className="text-slate-400">
          <span className="text-xl">›</span>
        </div>
      )}
    </div>
  );
};
