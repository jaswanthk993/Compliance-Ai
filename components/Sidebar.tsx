
import React from 'react';
import { LayoutDashboard, FileText, Upload, MessageSquare, PieChart, ShieldAlert, Sun, Moon } from 'lucide-react';
import { Policy } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activePolicy: Policy | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, activePolicy, isDarkMode, toggleTheme }) => {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'policy', label: 'Policy Management', icon: FileText },
    { id: 'evidence', label: 'Evidence Analysis', icon: Upload },
    { id: 'chat', label: 'Policy Assistant', icon: MessageSquare },
    { id: 'reports', label: 'Reports', icon: PieChart },
  ];

  return (
    <div className="w-[280px] bg-slate-950 text-slate-300 flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-10 transition-colors">
      <div className="p-8 border-b border-slate-900 flex items-center space-x-3 text-white">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <ShieldAlert className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-xl font-display font-medium tracking-tight block">Copilot</span>
          <span className="text-xs text-indigo-400 font-medium tracking-widest uppercase">Compliance AI</span>
        </div>
      </div>
      
      <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-600 mb-4 tracking-wider uppercase ml-2 mt-4">Menu</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isChat = item.id === 'chat';

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400 transition-colors'} />
              <span className="font-medium text-sm">{item.label}</span>
              {isChat && activePolicy && (
                <div className="ml-auto">
                    {activePolicy.isIndexed ? (
                         <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)] bg-pulse" title="Agent Trained & Ready"></div>
                    ) : (
                         <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" title="Training Required"></div>
                    )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-900">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-400 bg-slate-900/50 hover:bg-slate-900 hover:text-white rounded-xl transition-all group border border-slate-800/50"
        >
           <div className="flex items-center group-hover:text-slate-200">
              {isDarkMode ? <Moon size={16} className="mr-3 text-indigo-400" /> : <Sun size={16} className="mr-3 text-amber-400" />}
              <span>{isDarkMode ? 'Dark Node' : 'Light Node'}</span>
           </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
