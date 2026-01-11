
import React, { useState } from 'react';
import { WeddingPlan } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PlanDashboardProps {
  plan: WeddingPlan;
  onReset: () => void;
}

const COLORS = ['#9b1c1c', '#d4af37', '#fcd34d', '#7c2d12', '#9a3412', '#ea580c', '#c2410c'];

export const PlanDashboard: React.FC<PlanDashboardProps> = ({ plan, onReset }) => {
  const [activeTab, setActiveTab] = useState<'budget' | 'checklist' | 'vendors' | 'itinerary'>('budget');

  const chartData = plan.budgetBreakdown.map(item => ({
    name: item.category,
    value: item.estimatedAmount
  }));

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-shaadi-gold pb-6">
        <div>
          <h1 className="text-4xl font-bold text-shaadi-red">Your Wedding Vision</h1>
          <p className="text-gray-600 mt-2">{plan.summary}</p>
        </div>
        <button 
          onClick={onReset}
          className="px-6 py-2 border-2 border-shaadi-red text-shaadi-red hover:bg-shaadi-red hover:text-white transition-all rounded-full font-semibold"
        >
          Plan New Wedding
        </button>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 md:gap-4 border-b">
        {(['budget', 'checklist', 'vendors', 'itinerary'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 capitalize transition-all ${
              activeTab === tab 
                ? 'border-b-4 border-shaadi-gold text-shaadi-red font-bold' 
                : 'text-gray-500 hover:text-shaadi-red'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <main className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px]">
        {activeTab === 'budget' && (
          <div className="p-6 md:p-10 flex flex-col lg:flex-row gap-10">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-6 text-shaadi-red">Budget Breakdown</h2>
              <div className="space-y-4">
                {plan.budgetBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-lg hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-800">{item.category}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <p className="font-bold text-shaadi-red">₹{item.estimatedAmount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="p-6 md:p-10">
            <h2 className="text-2xl font-bold mb-6 text-shaadi-red">Wedding Checklist</h2>
            <div className="grid gap-4">
              {plan.checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 border rounded-xl hover:border-shaadi-gold transition-colors">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    item.priority === 'High' ? 'bg-red-500' : item.priority === 'Medium' ? 'bg-orange-400' : 'bg-green-400'
                  }`} title={item.priority + " Priority"} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.task}</p>
                    <p className="text-sm text-gray-500">{item.timeline}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    item.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="p-6 md:p-10">
            <h2 className="text-2xl font-bold mb-6 text-shaadi-red">Vendor Guide</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {plan.vendors.map((vendor, idx) => (
                <div key={idx} className="p-6 border border-shaadi-gold/30 bg-orange-50/30 rounded-2xl">
                  <h3 className="text-xl font-bold text-shaadi-red mb-2">{vendor.type}</h3>
                  <p className="text-sm font-semibold text-gray-600 mb-4">Estimated Range: {vendor.averagePriceRange}</p>
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <p className="text-gray-700 text-sm leading-relaxed italic">" {vendor.tips} "</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'itinerary' && (
          <div className="p-6 md:p-10">
            <h2 className="text-2xl font-bold mb-6 text-shaadi-red">Wedding Itinerary</h2>
            <div className="space-y-12">
              {plan.itinerary.map((day, idx) => (
                <div key={idx}>
                  <h3 className="text-xl font-bold text-shaadi-gold mb-6 border-b pb-2 inline-block">{day.day}</h3>
                  <div className="relative border-l-2 border-shaadi-gold ml-4 space-y-8 pb-4">
                    {day.events.map((event, eIdx) => (
                      <div key={eIdx} className="relative pl-8">
                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-shaadi-gold border-2 border-white" />
                        <span className="text-sm font-bold text-shaadi-red block">{event.time}</span>
                        <h4 className="font-bold text-gray-800 text-lg">{event.activity}</h4>
                        <p className="text-gray-600 mt-1 max-w-2xl">{event.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
