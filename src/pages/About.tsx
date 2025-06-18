
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream">
      <div className="flex items-center pt-6 px-6 pb-4">
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">About</h1>
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="w-20 h-20 bg-orange-brand rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="text-white text-4xl">🥤</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">SnapDrink</h2>
          <p className="text-gray-600 mb-4">Version 1.0.0</p>
          <p className="text-gray-700 leading-relaxed">
            Your smart drink companion for making healthier choices. Snap photos of drinks to instantly see nutrition info and get personalized health insights.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Instant drink recognition</li>
            <li>• Detailed nutrition analysis</li>
            <li>• Personalized health insights</li>
            <li>• Daily goal tracking</li>
            <li>• Drink history</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
          <div className="space-y-2 text-gray-700">
            <p>Email: support@snapdrink.com</p>
            <p>Website: www.snapdrink.com</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-2 text-blue-600 hover:bg-gray-50 rounded">
              Terms of Service
            </button>
            <button className="w-full text-left p-2 text-blue-600 hover:bg-gray-50 rounded">
              Privacy Policy
            </button>
            <button className="w-full text-left p-2 text-blue-600 hover:bg-gray-50 rounded">
              Licenses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
