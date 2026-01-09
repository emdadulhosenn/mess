
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Member, SharedExpenses, MessData, SummaryStats } from './types';
import { loadMessData, saveMessData, getMonthYearString } from './services/storage';
import { INITIAL_SHARED_EXPENSES } from './constants';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MembersPage from './pages/MembersPage';
import SharedPage from './pages/SharedPage';

const App: React.FC = () => {
  const [dataStore, setDataStore] = useState<MessData[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>(getMonthYearString());

  // Initialize data
  useEffect(() => {
    const loaded = loadMessData();
    if (loaded.length === 0) {
      // Create initial record if empty
      const initial: MessData = {
        month: getMonthYearString(),
        members: [],
        sharedExpenses: { ...INITIAL_SHARED_EXPENSES }
      };
      setDataStore([initial]);
    } else {
      setDataStore(loaded);
    }
  }, []);

  // Persist data when store changes
  useEffect(() => {
    if (dataStore.length > 0) {
      saveMessData(dataStore);
    }
  }, [dataStore]);

  // Current Month Data Selector
  const currentData = useMemo(() => {
    let monthData = dataStore.find(d => d.month === currentMonth);
    if (!monthData) {
      // If switching to a month that doesn't exist yet, clone from previous or create new
      monthData = {
        month: currentMonth,
        members: [],
        sharedExpenses: { ...INITIAL_SHARED_EXPENSES }
      };
    }
    return monthData;
  }, [dataStore, currentMonth]);

  // Stats Calculation Logic
  const stats = useMemo<SummaryStats>(() => {
    const members = currentData.members;
    const shared = currentData.sharedExpenses;
    
    const totalMeals = members.reduce((sum, m) => sum + m.meals, 0);
    const totalBazar = members.reduce((sum, m) => sum + m.bazarCost, 0);
    // Fix: Explicitly cast Object.values to number[] to avoid 'unknown' type error in reduce
    const totalShared = (Object.values(shared) as number[]).reduce((sum, v) => sum + v, 0);
    const totalExpense = totalBazar + totalShared;
    const mealRate = totalMeals > 0 ? totalBazar / totalMeals : 0;

    return {
      totalMeals,
      totalBazar,
      totalShared,
      totalExpense,
      mealRate
    };
  }, [currentData]);

  // Actions
  const updateCurrentMonthData = (updates: Partial<MessData>) => {
    setDataStore(prev => {
      const existingIdx = prev.findIndex(d => d.month === currentMonth);
      if (existingIdx > -1) {
        const newData = [...prev];
        newData[existingIdx] = { ...newData[existingIdx], ...updates };
        return newData;
      } else {
        return [...prev, { month: currentMonth, members: [], sharedExpenses: { ...INITIAL_SHARED_EXPENSES }, ...updates }];
      }
    });
  };

  const handleUpdateMember = (id: string, updates: Partial<Member>) => {
    const newMembers = currentData.members.map(m => m.id === id ? { ...m, ...updates } : m);
    updateCurrentMonthData({ members: newMembers });
  };

  const handleAddMember = (name: string) => {
    const newMember: Member = {
      id: crypto.randomUUID(),
      name,
      meals: 0,
      bazarCost: 0
    };
    updateCurrentMonthData({ members: [...currentData.members, newMember] });
  };

  const handleDeleteMember = (id: string) => {
    const newMembers = currentData.members.filter(m => m.id !== id);
    updateCurrentMonthData({ members: newMembers });
  };

  const handleUpdateSharedExpenses = (updates: Partial<SharedExpenses>) => {
    updateCurrentMonthData({ sharedExpenses: { ...currentData.sharedExpenses, ...updates } });
  };

  // Month Selector UI
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  
  const allMonths = years.flatMap(y => monthNames.map(m => `${m}-${y.toString().slice(-2)}`));

  const MonthSelector = (
    <select 
      value={currentMonth} 
      onChange={(e) => setCurrentMonth(e.target.value)}
      className="bg-white/10 text-white text-sm rounded border-none focus:ring-0 cursor-pointer"
    >
      {allMonths.map(m => (
        <option key={m} value={m} className="text-gray-900">{m}</option>
      ))}
    </select>
  );

  return (
    <Router>
      <Layout title="Mess Manager" monthSelector={MonthSelector}>
        <Routes>
          <Route path="/" element={<Dashboard stats={stats} />} />
          <Route 
            path="/members" 
            element={
              <MembersPage 
                members={currentData.members} 
                sharedExpenses={currentData.sharedExpenses}
                stats={stats}
                onUpdateMember={handleUpdateMember}
                onAddMember={handleAddMember}
                onDeleteMember={handleDeleteMember}
              />
            } 
          />
          <Route 
            path="/shared" 
            element={
              <SharedPage 
                expenses={currentData.sharedExpenses} 
                onUpdateExpense={handleUpdateSharedExpenses} 
              />
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;