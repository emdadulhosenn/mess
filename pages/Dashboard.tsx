
import React from 'react';
import { SummaryStats } from '../types';
import { TrendingUp, Utensils, DollarSign, Calculator } from 'lucide-react';

interface DashboardProps {
  stats: SummaryStats;
}

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className={`bg-white p-5 rounded-2xl shadow-sm border-l-4 ${color} flex items-center justify-between`}>
    <div>
      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-xl bg-gray-50 ${color.replace('border-', 'text-')}`}>
      {icon}
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Meal Rate" 
          value={stats.mealRate.toFixed(2)} 
          icon={<Calculator size={24} />} 
          color="border-amber-500" 
        />
        <StatCard 
          label="Total Meal" 
          value={stats.totalMeals} 
          icon={<Utensils size={24} />} 
          color="border-indigo-500" 
        />
        <StatCard 
          label="Total Expense" 
          value={`৳${stats.totalExpense.toLocaleString()}`} 
          icon={<TrendingUp size={24} />} 
          color="border-emerald-500" 
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-indigo-600" size={20} />
          Expense Breakdown
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Bazar Cost</span>
              <span className="font-semibold">৳{stats.totalBazar}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-indigo-500 h-2 rounded-full transition-all" 
                style={{ width: `${(stats.totalBazar / stats.totalExpense) * 100 || 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Shared Expenses</span>
              <span className="font-semibold">৳{stats.totalShared}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-amber-500 h-2 rounded-full transition-all" 
                style={{ width: `${(stats.totalShared / stats.totalExpense) * 100 || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <h4 className="text-indigo-800 font-bold mb-2">Calculation Rule</h4>
        <p className="text-indigo-700/80 text-sm leading-relaxed">
          The <b>Meal Rate</b> is calculated by dividing total Bazar Cost by the Total Meals. 
          Shared expenses (Rent, Wifi, etc.) are distributed equally among all members regardless of their meal count.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
