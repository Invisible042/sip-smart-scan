
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

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

        <div className="flex items-center pt-6 px-6 pb-4">
          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4 border border-white/20"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">About</h1>
        </div>

        <div className="px-6 space-y-6">
          <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 backdrop-blur-sm">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="text-white text-4xl">🥤</div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">SnapDrink</h2>
            <p className="text-slate-400 mb-4">Version 1.0.0</p>
            <p className="text-slate-300 leading-relaxed">
              Your smart drink companion for making healthier choices. Snap photos of drinks to instantly see nutrition info and get personalized health insights.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="font-semibold text-white mb-4">Features</h3>
            <ul className="space-y-2 text-slate-300">
              <li>• Instant drink recognition</li>
              <li>• Detailed nutrition analysis</li>
              <li>• Personalized health insights</li>
              <li>• Daily goal tracking</li>
              <li>• Drink history</li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <div className="space-y-2 text-slate-300">
              <p>Email: support@snapdrink.com</p>
              <p>Website: www.snapdrink.com</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-teal-400 hover:bg-white/5 rounded">
                Terms of Service
              </button>
              <button className="w-full text-left p-2 text-teal-400 hover:bg-white/5 rounded">
                Privacy Policy
              </button>
              <button className="w-full text-left p-2 text-teal-400 hover:bg-white/5 rounded">
                Licenses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
