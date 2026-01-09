
import React from 'react';
import { SharedExpenses } from '../types';
import { Home, Wifi, Zap, Flame, PlusCircle } from 'lucide-react';

interface SharedPageProps {
  expenses: SharedExpenses;
  onUpdateExpense: (updates: Partial<SharedExpenses>) => void;
}

const SharedPage: React.FC<SharedPageProps> = ({ expenses, onUpdateExpense }) => {
  const expenseFields = [
    { key: 'bua', label: 'Bua / Maid Cost', icon: <Home size={20} />, color: 'text-rose-500' },
    { key: 'wifi', label: 'Wifi Internet', icon: <Wifi size={20} />, color: 'text-blue-500' },
    { key: 'electricity', label: 'Electricity Bill', icon: <Zap size={20} />, color: 'text-amber-500' },
    { key: 'gas', label: 'Gas Bill', icon: <Flame size={20} />, color: 'text-orange-500' },
    { key: 'other', label: 'Other Shared Expenses', icon: <PlusCircle size={20} />, color: 'text-gray-500' },
  ];

  // Fix: Explicitly cast Object.values to number[] to avoid 'unknown' type error in reduce
  const total = (Object.values(expenses) as number[]).reduce((acc, val) => acc + val, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Common Mess Expenses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expenseFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                <span className={field.color}>{field.icon}</span>
                {field.label}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                <input 
                  type="number"
                  value={expenses[field.key as keyof SharedExpenses]}
                  onChange={(e) => onUpdateExpense({ [field.key]: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                  placeholder="0.00"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg flex justify-between items-center">
        <div>
          <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Total Shared Expenses</p>
          <h3 className="text-3xl font-black mt-1">৳{total.toLocaleString()}</h3>
        </div>
        <ReceiptIcon />
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-sm">
        <strong>Note:</strong> These costs are divided equally among all mess members automatically.
      </div>
    </div>
  );
};

const ReceiptIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-20">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
    <path d="M16 8h-6" />
    <path d="M16 12h-6" />
    <path d="M16 16h-6" />
    <path d="M8 8h.01" />
    <path d="M8 12h.01" />
    <path d="M8 16h.01" />
  </svg>
);

export default SharedPage;