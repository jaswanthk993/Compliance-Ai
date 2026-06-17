
import React, { useState, useEffect, useRef } from 'react';
import { Policy, IndustryType } from '../types';
import { ADKOrchestrator } from '../services/agentSystem';
import { Save, Search, Trash2, Plus, Clock, Loader2, FileUp, BrainCircuit, Factory, Stethoscope, Landmark, ShoppingBag, Truck, Globe, ExternalLink, ShieldCheck, HardHat, Cpu, Zap, MoreVertical, Archive, Construction, ShoppingCart, Box, Server, Shield } from 'lucide-react';

interface PolicyManagerProps {
  currentPolicy: Policy | null;
  onPolicyUpdate: (policy: Policy) => void;
}

const PolicyManager: React.FC<PolicyManagerProps> = ({ currentPolicy, onPolicyUpdate }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'web_insights'>('editor');
  const [text, setText] = useState(currentPolicy?.content || '');
  const [title, setTitle] = useState(currentPolicy?.title || '');
  const [extractedRules, setExtractedRules] = useState<string[]>(currentPolicy?.rules || []);
  const [editingId, setEditingId] = useState<string | null>(currentPolicy?.id || null);
  const [isIndexed, setIsIndexed] = useState(currentPolicy?.isIndexed || false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ summary: string; sources: any[] } | null>(null);
  const [savedPolicies, setSavedPolicies] = useState<Policy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPolicies();
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadPolicies = async () => {
    const res = await ADKOrchestrator.getLibrary();
    if (res.success && res.data) setSavedPolicies(res.data);
  };

  const getIndustryIcon = (industry?: IndustryType) => {
    const className = "w-3 h-3 text-slate-500";
    switch (industry) {
      case 'Manufacturing': return <Factory className={className} />;
      case 'Healthcare': return <Stethoscope className={className} />;
      case 'Finance': return <Landmark className={className} />;
      case 'Construction': return <HardHat className={className} />;
      case 'Retail': return <ShoppingCart className={className} />;
      case 'Logistics': return <Truck className={className} />;
      case 'Technology': return <Cpu className={className} />;
      case 'Energy': return <Zap className={className} />;
      default: return <Shield className={className} />;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const res = await ADKOrchestrator.ingestPolicy(base64, file.type, file.name);
      if (res.success && res.data) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
        setText(res.data.text);
        setExtractedRules(res.data.rules);
        setIsIndexed(false);
        setEditingId(null);
      }
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleVerify = async () => {
    if (!text) return;
    setIsVerifying(true);
    setActiveTab('web_insights');
    const res = await ADKOrchestrator.verifyPolicy(text);
    if (res.success && res.data) setVerificationResult(res.data);
    setIsVerifying(false);
  };

  const handleTrain = async () => {
    if (!editingId) return;
    setIsTraining(true);
    const policy: Policy = { id: editingId, title, content: text, lastUpdated: new Date().toISOString(), rules: extractedRules, isIndexed };
    const res = await ADKOrchestrator.trainRagAgent(policy);
    if (res.success) {
      setIsIndexed(true);
      loadPolicies();
      onPolicyUpdate({ ...policy, isIndexed: true });
    }
    setIsTraining(false);
  };

  const handleSave = async () => {
    if (!title) return;
    const policy: Policy = { id: editingId || Date.now().toString(), title, content: text, lastUpdated: new Date().toISOString(), rules: extractedRules, isIndexed };
    const res = await ADKOrchestrator.savePolicy(policy);
    if (res.success) {
      setEditingId(policy.id);
      loadPolicies();
      onPolicyUpdate(policy);
    }
  };

  const handleLoad = (p: Policy) => {
    setEditingId(p.id); setTitle(p.title); setText(p.content); setExtractedRules(p.rules); setIsIndexed(!!p.isIndexed);
    onPolicyUpdate(p); setVerificationResult(null); setActiveTab('editor');
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const filtered = savedPolicies.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.industry && p.industry.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-4xl font-display font-medium text-slate-900 dark:text-white tracking-tight">Policy Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Manage SOPs and verify compliance with Gemini Search.</p>
        </div>
        <button onClick={() => { setEditingId(null); setTitle(''); setText(''); setExtractedRules([]); setIsIndexed(false); }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center transition-colors font-medium shadow-sm text-sm">
          <Plus className="w-4 h-4 mr-2" /> New Policy
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-80 flex-shrink-0 bg-white dark:bg-slate-900/50 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 h-[650px] flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Master Library</h2>
            <div className="relative group">
              <button 
                onClick={() => searchInputRef.current?.focus()}
                className="absolute left-3 top-2.5 text-slate-400 group-hover:text-indigo-500 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search procedures..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-all shadow-sm" 
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filtered.map(p => (
              <div key={p.id} onClick={() => handleLoad(p)} className={`group p-3 rounded-lg border cursor-pointer transition-all relative ${editingId === p.id ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-100'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1 truncate">
                    <div className="flex items-center gap-1.5 mb-1">
                      {getIndustryIcon(p.industry)}
                      <h3 className={`font-medium text-sm truncate ${editingId === p.id ? 'text-blue-700' : 'text-slate-700'}`}>{p.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" /> {new Date(p.lastUpdated).toLocaleDateString()}
                      {p.isIndexed && <span className="bg-green-100 text-green-700 px-1.5 rounded-full flex items-center"><BrainCircuit className="w-2.5 h-2.5 mr-1" /> trained</span>}
                    </div>
                  </div>
                  <button onClick={e => toggleMenu(e, p.id)} className="p-1 rounded hover:bg-slate-200"><MoreVertical className="w-4 h-4 text-slate-500" /></button>
                  {openMenuId === p.id && (
                    <div ref={menuRef} className="absolute right-2 top-10 w-32 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-1">
                      <button onClick={e => { e.stopPropagation(); ADKOrchestrator.archivePolicy(p.id).then(loadPolicies); setOpenMenuId(null); }} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center"><Trash2 className="w-3 h-3 mr-2" /> Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[650px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1 mr-4">
              <input type="text" placeholder="Policy Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 text-lg font-bold border-b border-transparent focus:border-blue-500 focus:outline-none" />
              <div className="flex gap-4 mt-2">
                <button onClick={() => setActiveTab('editor')} className={`text-sm font-medium pb-1 border-b-2 ${activeTab === 'editor' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500'}`}>Editor</button>
                <button onClick={() => setActiveTab('web_insights')} className={`text-sm font-medium pb-1 border-b-2 ${activeTab === 'web_insights' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500'}`}>Insights</button>
              </div>
            </div>
            <div className="flex gap-2">
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
              <button onClick={() => fileInputRef.current?.click()} className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors flex items-center">{isProcessing ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <FileUp className="w-4 h-4 mr-2" />} Upload</button>
              <button onClick={handleVerify} className="bg-sky-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-sky-700 flex items-center shadow-md transition-all">
                {isVerifying ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Search className="w-4 h-4 mr-2" />} Search Verification
              </button>
              <button onClick={handleTrain} className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center border ${isIndexed ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{isTraining ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <BrainCircuit className="w-4 h-4 mr-2" />} {isIndexed ? 'Retrain' : 'Train'}</button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'editor' ? (
              <div className="flex h-full gap-6">
                <textarea className="flex-1 p-4 border border-slate-200 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 bg-slate-50" value={text} onChange={e => setText(e.target.value)} placeholder="Policy content..."></textarea>
                <div className="w-64 flex flex-col">
                  <span className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Rules Extraction</span>
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {extractedRules.map((r, i) => <div key={i} className="p-3 text-xs bg-slate-50 border border-slate-100 rounded-lg text-slate-600 leading-relaxed font-medium">{r}</div>)}
                    {extractedRules.length === 0 && <div className="text-[10px] text-slate-400 text-center py-10 italic">Rules will appear here after ingestion or manual entry.</div>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full bg-slate-50 rounded-lg border p-6 overflow-y-auto">
                {isVerifying ? <div className="h-full flex flex-col items-center justify-center text-slate-400"><Loader2 className="animate-spin w-8 h-8 mb-2" /><p className="font-bold">Browsing regulatory updates...</p></div> : !verificationResult ? <div className="h-full flex flex-col items-center justify-center text-slate-300"><Globe className="w-12 h-12 mb-4 opacity-20" /><p className="text-sm font-medium">Click "Search Verification" to validate your policy against live regulations.</p></div> : (
                  <div className="space-y-6">
                    <div><h3 className="text-sm font-bold flex items-center text-slate-700 uppercase mb-3"><ShieldCheck className="w-4 h-4 mr-2 text-indigo-600" /> AI Verification Analysis</h3><div className="bg-white p-6 rounded-xl border border-slate-200 text-sm leading-relaxed text-slate-700 shadow-sm">{verificationResult.summary}</div></div>
                    <div><h3 className="text-sm font-bold flex items-center text-slate-700 uppercase mb-3"><ExternalLink className="w-4 h-4 mr-2 text-indigo-600" /> Grounding Sources</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{verificationResult.sources.map((s, i) => <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="p-4 bg-white border border-slate-100 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all flex items-center text-sm truncate group"><div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mr-3 font-black group-hover:bg-indigo-600 group-hover:text-white transition-colors">{i + 1}</div><span className="truncate font-medium text-slate-600 group-hover:text-indigo-600">{s.title}</span></a>)}</div></div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
            <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl hover:bg-blue-700 flex items-center shadow-lg shadow-blue-500/20 transition-all font-bold active:scale-95"><Save className="w-4 h-4 mr-2" /> Save Policy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyManager;
