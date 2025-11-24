
import React from 'react';
import { LayoutDashboard, FileText, Upload, MessageSquare, PieChart, ShieldAlert, Sun, Moon, LogOut } from 'lucide-react';
import { Policy } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activePolicy: Policy | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, activePolicy, isDarkMode, toggleTheme, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'policy', label: 'Policy Management', icon: FileText },
    { id: 'evidence', label: 'Evidence Analysis', icon: Upload },
    { id: 'chat', label: 'Policy Assistant', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: PieChart },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-10">
      <div className="p-6 border-b border-slate-700 flex items-center space-x-2">
        <ShieldAlert className="w-8 h-8 text-blue-400" />
        <span className="text-xl font-bold tracking-tight">ComplianceAI</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isChat = item.id === 'chat';

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
              {isChat && activePolicy && (
                <div className="ml-auto">
                    {activePolicy.isIndexed ? (
                         <div className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.6)]" title="Agent Trained & Ready"></div>
                    ) : (
                         <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" title="Training Required"></div>
                    )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-400 bg-slate-800/50 hover:bg-slate-800 hover:text-white rounded-lg transition-all group"
        >
           <div className="flex items-center group-hover:text-slate-200">
              {isDarkMode ? <Moon size={18} className="mr-2 text-indigo-400" /> : <Sun size={18} className="mr-2 text-amber-400" />}
              <span>{isDarkMode ? 'Dark' : 'Light'}</span>
           </div>
           <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-600'}`}>
              <div className={`w-2.5 h-2.5 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-sm ${isDarkMode ? 'left-5' : 'left-0.5'}`}></div>
           </div>
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-all"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
