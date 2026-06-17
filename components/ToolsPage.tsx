
import React, { useState } from 'react';
import { Camera, FileText, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { Policy, AnalysisResult } from '../types';
import EvidenceAnalyzer from './EvidenceAnalyzer';
import PolicyManager from './PolicyManager';

interface ToolsPageProps {
  activePolicy: Policy | null;
  onPolicyUpdate: (policy: Policy) => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

const ToolsPage: React.FC<ToolsPageProps> = ({ activePolicy, onPolicyUpdate, onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState<'image' | 'policy'>('image');

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 md:p-12 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">AI Compliance Tools</h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                Multimodal inspection agents powered by Google Gemini. Upload evidence or policies to begin instant analysis.
            </p>
        </div>

        {/* Switcher */}
        <div className="flex bg-white rounded-[32px] p-3 shadow-2xl shadow-slate-200/50 border border-slate-100 mb-16 max-w-2xl mx-auto">
          <button 
            onClick={() => setActiveTab('image')}
            className={`flex-1 flex items-center justify-center space-x-4 py-5 rounded-2xl font-black text-lg transition-all duration-300 ${
              activeTab === 'image' 
                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 ring-4 ring-blue-500/10' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Camera size={24} />
            <span>Image Analysis</span>
          </button>
          <button 
            onClick={() => setActiveTab('policy')}
            className={`flex-1 flex items-center justify-center space-x-4 py-5 rounded-2xl font-black text-lg transition-all duration-300 ${
              activeTab === 'policy' 
                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 ring-4 ring-blue-500/10' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText size={24} />
            <span>Policy Analysis</span>
          </button>
        </div>

        {/* Dynamic Tool Container */}
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[600px]">
            {activeTab === 'image' ? (
                <EvidenceAnalyzer activePolicy={activePolicy} onAnalysisComplete={onAnalysisComplete} />
            ) : (
                <PolicyManager currentPolicy={activePolicy} onPolicyUpdate={onPolicyUpdate} />
            )}
          </div>
        </div>
        
        {/* Status Indicators Bar */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-10 md:gap-16">
          <div className="flex items-center space-x-3 group cursor-default">
            <div className="p-2.5 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform"><Sparkles size={20} className="text-blue-600" /></div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Gemini 2.5 Active</span>
          </div>
          <div className="flex items-center space-x-3 group cursor-default">
            <div className="p-2.5 bg-emerald-50 rounded-xl group-hover:scale-110 transition-transform"><Activity size={20} className="text-emerald-600" /></div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Orchestrator Online</span>
          </div>
          <div className="flex items-center space-x-3 group cursor-default">
            <div className="p-2.5 bg-amber-50 rounded-xl group-hover:scale-110 transition-transform"><ShieldCheck size={20} className="text-amber-600" /></div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Grounding Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
