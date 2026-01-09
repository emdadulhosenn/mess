
import React, { useState } from 'react';
import { Menu, X, Home, Users, Settings, Receipt, ChevronLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  monthSelector?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title, monthSelector }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={20} /> },
    { label: 'Members', path: '/members', icon: <Users size={20} /> },
    { label: 'Shared Expenses', path: '/shared', icon: <Receipt size={20} /> },
  ];

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* AppBar */}
      <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {location.pathname !== '/' && (
               <Link to="/" className="p-1 -ml-1 hover:bg-white/10 rounded-full">
                 <ChevronLeft size={24} />
               </Link>
            )}
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {monthSelector}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-64 bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b flex items-center justify-between bg-indigo-50">
          <span className="font-bold text-indigo-800">Mess Manager</span>
          <button onClick={closeDrawer} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <nav className="p-2 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeDrawer}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 pb-20">
        {children}
      </main>
    </div>
  );
};

export default Layout;
