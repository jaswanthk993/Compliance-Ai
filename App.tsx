
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PolicyManager from './components/PolicyManager';
import EvidenceAnalyzer from './components/EvidenceAnalyzer';
import ChatInterface from './components/ChatInterface';
import Reports from './components/Reports';
import CopilotWidget from './components/CopilotWidget';
import Login from './components/Login';
import { Policy, AnalysisResult } from './types';
import { CheckCircle, Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activePolicy, setActivePolicy] = useState<Policy | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResults(prev => [result, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard results={analysisResults} />;
      case 'policy': return <PolicyManager currentPolicy={activePolicy} onPolicyUpdate={setActivePolicy} />;
      case 'evidence': return <EvidenceAnalyzer activePolicy={activePolicy} onAnalysisComplete={handleAnalysisComplete} />;
      case 'chat': return <ChatInterface activePolicy={activePolicy} />;
      case 'reports': return <Reports results={analysisResults} />;
      default: return <Dashboard results={analysisResults} />;
    }
  };

  if (loading) {
      return (
          <div className="h-screen w-full flex items-center justify-center bg-slate-50">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
      );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className={`flex h-screen font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activePolicy={activePolicy} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-1 ml-64 h-screen overflow-auto relative">
        <header className={`py-3 px-8 flex justify-between items-center sticky top-0 z-10 border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
           <div className="flex items-center space-x-2 text-sm">
             <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Organization</span>
             <span className={isDarkMode ? 'text-slate-600' : 'text-slate-400'}>/</span>
             <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Safety & Compliance Division</span>
           </div>
           <div className="flex items-center space-x-4">
             {activePolicy && (
               <span className={`text-xs px-2 py-1 rounded border flex items-center ${activePolicy.industry ? (isDarkMode ? 'bg-indigo-900/30 text-indigo-300 border-indigo-800' : 'bg-indigo-50 text-indigo-700 border-indigo-100') : (isDarkMode ? 'bg-blue-900/30 text-blue-300 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-100')}`}>
                 {activePolicy.industry && <CheckCircle className="w-3 h-3 mr-1" />}
                 Active: {activePolicy.title}
               </span>
             )}
             <div className="flex items-center gap-2">
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-sm overflow-hidden ${isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-slate-200 text-slate-600 border-white'}`}>
                    {user.photoURL ? <img src={user.photoURL} alt="User" className="w-full h-full object-cover" /> : user.displayName?.substring(0,2).toUpperCase() || 'U'}
                </div>
             </div>
           </div>
        </header>

        {renderContent()}

        {/* Global Copilot Widget */}
        <CopilotWidget activePolicy={activePolicy} />
      </main>
    </div>
  );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
