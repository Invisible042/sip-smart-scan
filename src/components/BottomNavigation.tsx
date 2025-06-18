
import { useNavigate, useLocation } from "react-router-dom";

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/history", icon: "📋", label: "History" },
    { path: "/", icon: "🏠", label: "Home" },
    { path: "/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-colors ${
              location.pathname === item.path
                ? "bg-orange-brand/10 text-orange-brand"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
