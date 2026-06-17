
import React from 'react';
import { ShieldCheck, LogOut, Menu, UserCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate }) => {
  const { user } = useAuth();
  
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'tools', label: 'Tools' },
    { id: 'industries', label: 'Industries' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'about', label: 'About' },
    { id: 'dashboard', label: 'Admin Dashboard' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-50 h-20 flex items-center px-8">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-11 h-11 bg-blue-600 rounded-[16px] flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <ShieldCheck className="text-white w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">AI Compliance Copilot</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-10">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`text-[15px] font-bold tracking-tight transition-all relative py-2 ${
                activePage === item.id 
                  ? 'text-blue-600' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {item.label}
              {activePage === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Action Button & Profile */}
        <div className="flex items-center space-x-6">
          <div className="hidden sm:flex items-center gap-3 pl-6 border-l border-slate-100">
             <div className="text-right hidden md:block">
                <p className="text-xs font-black text-slate-900">{user?.displayName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Compliance Lead</p>
             </div>
             <div className="relative group">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group-hover:border-blue-100 transition-all cursor-pointer">
                    {user?.photoURL ? <img src={user.photoURL} alt="User" /> : <UserCircle className="text-slate-300" />}
                </div>
             </div>
          </div>
          <button 
            onClick={() => onNavigate('tools')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-7 py-3 rounded-2xl text-[15px] font-black shadow-xl shadow-blue-600/20 transition-all active:scale-95"
          >
            Get Started
          </button>
          <button className="lg:hidden p-2 text-slate-600">
             <Menu className="w-7 h-7" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
