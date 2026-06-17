
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PolicyManager from './components/PolicyManager';
import EvidenceAnalyzer from './components/EvidenceAnalyzer';
import ChatInterface from './components/ChatInterface';
import Reports from './components/Reports';
import { Policy, AnalysisResult } from './types';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activePolicy, setActivePolicy] = useState<Policy | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResults(prev => [result, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard results={analysisResults} />;
      case 'policy':
        return <PolicyManager currentPolicy={activePolicy} onPolicyUpdate={setActivePolicy} />;
      case 'evidence':
        return <EvidenceAnalyzer activePolicy={activePolicy} onAnalysisComplete={handleAnalysisComplete} />;
      case 'chat':
        return <ChatInterface activePolicy={activePolicy} />;
      case 'reports':
        return <Reports results={analysisResults} />;
      default:
        return <Dashboard results={analysisResults} />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark bg-slate-950 font-sans' : 'bg-slate-50 font-sans'}`}>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activePolicy={activePolicy}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-1 ml-[280px] overflow-y-auto min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto py-10 px-8">
          {renderContent()}
        </div>
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
};

export default App;
