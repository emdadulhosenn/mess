
import React, { useState } from 'react';
import { Member, SharedExpenses, SummaryStats } from '../types';
import { Plus, Trash2, UserPlus, Info } from 'lucide-react';

interface MembersPageProps {
  members: Member[];
  sharedExpenses: SharedExpenses;
  stats: SummaryStats;
  onUpdateMember: (id: string, updates: Partial<Member>) => void;
  onAddMember: (name: string) => void;
  onDeleteMember: (id: string) => void;
}

const MembersPage: React.FC<MembersPageProps> = ({ members, sharedExpenses, stats, onUpdateMember, onAddMember, onDeleteMember }) => {
  const [newMemberName, setNewMemberName] = useState('');
  
  const handleAdd = () => {
    if (newMemberName.trim()) {
      onAddMember(newMemberName.trim());
      setNewMemberName('');
    }
  };

  const sharedPerHead = members.length > 0 ? stats.totalShared / members.length : 0;

  return (
    <div className="space-y-6">
      {/* Add Member UI */}
      <div className="flex gap-2">
        <input 
          type="text" 
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          placeholder="New Member Name"
          className="flex-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button 
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <UserPlus size={20} />
          <span className="hidden sm:inline">Add Member</span>
        </button>
      </div>

      {/* Scrollable Table Wrapper */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Member Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Meals</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Bazar</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Meal Cost</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Shared</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Total Cost</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Balance</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const mealCost = member.meals * stats.mealRate;
                const totalCost = mealCost + sharedPerHead;
                const balance = member.bazarCost - totalCost;

                return (
                  <tr key={member.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{member.name}</td>
                    <td className="px-4 py-3">
                      <input 
                        type="number"
                        step="0.5"
                        value={member.meals}
                        onChange={(e) => onUpdateMember(member.id, { meals: parseFloat(e.target.value) || 0 })}
                        className="w-16 px-2 py-1 border rounded focus:ring-1 focus:ring-indigo-500 outline-none text-center"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number"
                        value={member.bazarCost}
                        onChange={(e) => onUpdateMember(member.id, { bazarCost: parseFloat(e.target.value) || 0 })}
                        className="w-24 px-2 py-1 border rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-600">৳{mealCost.toFixed(1)}</td>
                    <td className="px-4 py-3 text-gray-600">৳{sharedPerHead.toFixed(1)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">৳{totalCost.toFixed(1)}</td>
                    <td className={`px-4 py-3 font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {balance >= 0 ? `TAKE: ৳${balance.toFixed(1)}` : `GIVEN: ৳${Math.abs(balance).toFixed(1)}`}
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => onDeleteMember(member.id)}
                        className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {members.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    No members added for this month.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <Info className="text-blue-500 mt-1 flex-shrink-0" size={20} />
        <div className="text-sm text-blue-700">
          <p className="font-semibold mb-1">How to read the Balance:</p>
          <ul className="list-disc ml-4 space-y-1">
            <li><span className="text-rose-600 font-bold uppercase">GIVEN:</span> Member has paid less than their share. They need to pay more to the mess fund.</li>
            <li><span className="text-emerald-600 font-bold uppercase">TAKE:</span> Member has paid more than their share (usually through bazar shopping). They should get back money from the fund.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
