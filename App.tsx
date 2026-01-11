
import React, { useState } from 'react';
import { WeddingDetails, WeddingPlan } from './types';
import { generateWeddingPlan } from './services/geminiService';
import { PlanDashboard } from './components/PlanDashboard';

const App: React.FC = () => {
  const [details, setDetails] = useState<WeddingDetails>({
    date: '',
    city: '',
    budget: 1500000,
    guests: 200,
    preferences: ''
  });
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('');
  const [plan, setPlan] = useState<WeddingPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStage('Initializing AI Planning Agent...');
    try {
      const generatedPlan = await generateWeddingPlan(details, (currentStage) => {
        setStage(currentStage);
      });
      setPlan(generatedPlan);
    } catch (err) {
      console.error(err);
      setError('Something went wrong generating your plan. Please try again.');
    } finally {
      setLoading(false);
      setStage('');
    }
  };

  const handleReset = () => {
    setPlan(null);
    setError(null);
  };

  if (plan) {
    return <PlanDashboard plan={plan} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative Background Patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-shaadi-red opacity-5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-shaadi-gold opacity-5 rounded-full -ml-48 -mb-48"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-shaadi-red mb-4">ShaadiPlanner AI</h1>
          <p className="text-xl text-gray-600 font-light">Crafting your dream Indian wedding with intelligent precision.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-shaadi-gold/20">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Wedding Date</label>
                <input
                  required
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-shaadi-gold focus:ring-2 focus:ring-shaadi-gold/20 outline-none transition-all"
                  value={details.date}
                  onChange={(e) => setDetails({ ...details, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">City / Location</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Udaipur, Goa, Delhi"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-shaadi-gold focus:ring-2 focus:ring-shaadi-gold/20 outline-none transition-all"
                  value={details.city}
                  onChange={(e) => setDetails({ ...details, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Estimated Budget (₹)</label>
                <input
                  required
                  type="number"
                  min="100000"
                  step="50000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-shaadi-gold focus:ring-2 focus:ring-shaadi-gold/20 outline-none transition-all"
                  value={details.budget}
                  onChange={(e) => setDetails({ ...details, budget: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Estimated Guest Count</label>
                <input
                  required
                  type="number"
                  min="20"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-shaadi-gold focus:ring-2 focus:ring-shaadi-gold/20 outline-none transition-all"
                  value={details.guests}
                  onChange={(e) => setDetails({ ...details, guests: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">Special Preferences & Style</label>
              <textarea
                placeholder="e.g. Minimalist decor, traditional Rajasthani food, sustainable gifts, focus on outdoor venues..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-shaadi-gold focus:ring-2 focus:ring-shaadi-gold/20 outline-none transition-all h-32 resize-none"
                value={details.preferences}
                onChange={(e) => setDetails({ ...details, preferences: e.target.value })}
              />
            </div>

            {error && <p className="text-red-600 text-center font-medium bg-red-50 p-3 rounded-lg">{error}</p>}

            <button
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg ${
                loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-shaadi-red hover:bg-red-800 hover:shadow-xl active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                  <span className="text-xs font-normal opacity-80 animate-pulse">{stage}</span>
                </div>
              ) : 'Generate Wedding Plan'}
            </button>
          </form>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-gray-600 px-4">
          <div>
            <div className="text-shaadi-gold text-3xl mb-2">✨</div>
            <h4 className="font-bold text-gray-800 mb-1">AI Curated</h4>
            <p className="text-sm">Personalized suggestions tailored to your cultural nuances and style.</p>
          </div>
          <div>
            <div className="text-shaadi-gold text-3xl mb-2">💰</div>
            <h4 className="font-bold text-gray-800 mb-1">Smart Budgeting</h4>
            <p className="text-sm">Detailed financial breakdowns to help you manage costs effectively.</p>
          </div>
          <div>
            <div className="text-shaadi-gold text-3xl mb-2">📋</div>
            <h4 className="font-bold text-gray-800 mb-1">Full Checklist</h4>
            <p className="text-sm">Step-by-step itinerary and task list so you never miss a ritual.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
