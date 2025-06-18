
interface SettingsItemProps {
  icon: string;
  title: string;
  hasArrow?: boolean;
}

export const SettingsItem = ({ icon, title, hasArrow = false }: SettingsItemProps) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 flex items-center justify-center">
          <span className="text-xl">{icon}</span>
        </div>
        <span className="text-lg font-medium text-gray-900">{title}</span>
      </div>
      
      {hasArrow && (
        <div className="text-gray-400">
          <span className="text-xl">›</span>
        </div>
      )}
    </div>
  );
};
