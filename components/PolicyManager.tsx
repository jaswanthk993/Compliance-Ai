
import React, { useState, useEffect, useRef } from 'react';
import { Policy } from '../types';
import { ADKOrchestrator } from '../services/agentSystem';
import { Save, Search, Trash2, Plus, Clock, Loader2, FileUp, BrainCircuit, X, Factory, Stethoscope, Landmark, ShoppingBag, Truck, Globe, ExternalLink, ShieldCheck, HardHat, Cpu, Zap } from 'lucide-react';

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
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    const response = await ADKOrchestrator.getLibrary();
    if (response.success && response.data) {
      setSavedPolicies(response.data);
    }
  };

  const handleLoadDefaults = async () => {
    setIsProcessing(true);
    await ADKOrchestrator.loadDemoPolicies();
    loadPolicies();
    setIsProcessing(false);
  };

  const filteredPolicies = savedPolicies.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.rules.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        // Calls Orchestrator Endpoint: POST /ingest/policy
        const response = await ADKOrchestrator.ingestPolicy(base64String, file.type, file.name);
        
        if (response.success && response.data) {
          setTitle(file.name.replace('.pdf', '').replace('.txt', ''));
          setText(response.data.text);
          setExtractedRules(response.data.rules);
          setIsIndexed(false);
          setEditingId(null);
          setVerificationResult(null);
        } else {
          alert("Agent failed to read document.");
        }
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
    }
  };

  const handleVerifyWithSearch = async () => {
    if (!text) return alert("No content to verify.");
    setIsVerifying(true);
    setActiveTab('web_insights');
    try {
        const response = await ADKOrchestrator.verifyPolicy(text);
        if (response.success && response.data) {
            setVerificationResult(response.data);
        } else {
            alert("Verification failed.");
        }
    } catch(e) {
        alert("Error verifying policy.");
    } finally {
        setIsVerifying(false);
    }
  };

  const handleTrainAgent = async () => {
    if (!editingId) return alert("Please save the policy first before training.");
    
    setIsTraining(true);
    const policyState: Policy = { 
      id: editingId, 
      title, 
      content: text, 
      lastUpdated: new Date().toISOString(), 
      rules: extractedRules,
      isIndexed: isIndexed 
    };

    try {
        const response = await ADKOrchestrator.trainRagAgent(policyState);
        
        if (response.success) {
            setIsIndexed(true);
            loadPolicies();
            onPolicyUpdate({ ...policyState, isIndexed: true });
            alert("Training Complete! The Policy Assistant is now ready to answer questions in the Chat tab.");
        } else {
            alert("Training failed: " + response.message);
        }
    } catch (error) {
        alert("An error occurred during training.");
    } finally {
        setIsTraining(false);
    }
  };

  const handleSave = async () => {
    if (!title) return alert("Enter title");
    const newPolicy: Policy = {
      id: editingId || Date.now().toString(),
      title,
      content: text,
      lastUpdated: new Date().toISOString(),
      rules: extractedRules,
      isIndexed: isIndexed
    };
    const response = await ADKOrchestrator.savePolicy(newPolicy);
    if (response.success) {
        setEditingId(newPolicy.id);
        onPolicyUpdate(newPolicy);
        loadPolicies();
        alert("Policy saved!");
    }
  };

  const handleLoadPolicy = (policy: Policy) => {
    setEditingId(policy.id);
    setTitle(policy.title);
    setText(policy.content);
    setExtractedRules(policy.rules);
    setIsIndexed(!!policy.isIndexed);
    onPolicyUpdate(policy);
    setVerificationResult(null);
    setActiveTab('editor');
  };

  const handleNewPolicy = () => {
    setEditingId(null);
    setTitle('');
    setText('');
    setExtractedRules([]);
    setIsIndexed(false);
    setVerificationResult(null);
    setActiveTab('editor');
  };

  const handleDeletePolicy = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Delete policy?")) {
      await ADKOrchestrator.archivePolicy(id);
      loadPolicies();
      if (editingId === id) handleNewPolicy();
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Policy Management</h1>
          <p className="text-slate-500 mt-2">Manage SOPs and verify compliance with Google Search.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={handleNewPolicy} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 flex items-center transition-colors font-medium shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Policy
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[650px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Policy Library</h2>
            <div className="relative">
              <button 
                onClick={handleLoadDefaults}
                className="absolute left-3 top-2.5 text-slate-400 hover:text-blue-500 cursor-pointer"
                title="Load Mandatory Policies"
              >
                 <Search className="h-4 w-4" />
              </button>
              <input 
                type="text" 
                placeholder="Search or Click Icon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredPolicies.map((policy) => (
                <div 
                  key={policy.id}
                  onClick={() => handleLoadPolicy(policy)}
                  className={`group p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    editingId === policy.id ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white border-slate-100 hover:border-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                          {policy.industry === 'Manufacturing' && <Factory className="w-3 h-3 text-slate-500" />}
                          {policy.industry === 'Healthcare' && <Stethoscope className="w-3 h-3 text-slate-500" />}
                          {policy.industry === 'Finance' && <Landmark className="w-3 h-3 text-slate-500" />}
                          {policy.industry === 'Retail' && <ShoppingBag className="w-3 h-3 text-slate-500" />}
                          {policy.industry === 'Logistics' && <Truck className="w-3 h-3 text-slate-500" />}
                          {policy.industry === 'Construction' && <HardHat className="w-3 h-3 text-slate-500" />}
                          {policy.industry === 'Technology' && <Cpu className="w-3 h-3 text-slate-500" />}
                          {policy.industry === 'Energy' && <Zap className="w-3 h-3 text-slate-500" />}
                          <h3 className={`font-medium text-sm truncate ${editingId === policy.id ? 'text-blue-700' : 'text-slate-700'}`}>
                            {policy.title}
                          </h3>
                      </div>
                      <div className="flex items-center mt-1 gap-2">
                        <span className="text-xs text-slate-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(policy.lastUpdated).toLocaleDateString()}
                        </span>
                        {policy.isIndexed && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded-full flex items-center">
                            <BrainCircuit className="w-3 h-3 mr-1" /> Trained
                          </span>
                        )}
                      </div>
                    </div>
                    <button onClick={(e) => handleDeletePolicy(e, policy.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all ml-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[650px]">
            
            {/* Header / Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
               <div className="flex flex-col gap-1 flex-1">
                 <input
                    type="text"
                    placeholder="Policy Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 text-lg font-bold border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  <div className="flex gap-4 mt-2">
                    <button 
                        onClick={() => setActiveTab('editor')}
                        className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'editor' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500'}`}
                    >
                        Editor & Rules
                    </button>
                    <button 
                        onClick={() => setActiveTab('web_insights')}
                        className={`text-sm font-medium pb-1 border-b-2 transition-colors flex items-center ${activeTab === 'web_insights' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500'}`}
                    >
                        <Globe className="w-3 h-3 mr-1.5" />
                        Web Insights
                    </button>
                  </div>
               </div>
              
              <div className="flex gap-2 flex-wrap">
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.txt,application/pdf,text/plain" onChange={handleFileUpload} />
                <button onClick={() => fileInputRef.current?.click()} disabled={isProcessing} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-lg hover:bg-indigo-100 flex items-center text-sm font-medium transition-colors">
                   {isProcessing ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <FileUp className="w-4 h-4 mr-2" />}
                   Upload Policy
                </button>
                <button onClick={handleVerifyWithSearch} disabled={isVerifying || !text} className="bg-sky-50 text-sky-700 border border-sky-200 px-3 py-2 rounded-lg hover:bg-sky-100 flex items-center text-sm font-medium transition-colors">
                    {isVerifying ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
                    Verify with Search
                </button>
                <button onClick={handleTrainAgent} disabled={!editingId || isTraining} className={`px-3 py-2 rounded-lg flex items-center text-sm font-medium transition-colors border ${isIndexed ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'}`}>
                  {isTraining ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                  {isTraining ? 'Training...' : isIndexed ? 'Retrain Assistant' : 'Train Policy Assistant'}
                </button>
              </div>
            </div>
            
            {/* Content Switcher */}
            {activeTab === 'editor' ? (
                <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                <div className="flex-1 flex flex-col min-h-0 relative">
                    {isProcessing && (
                    <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center backdrop-blur-sm rounded-lg">
                        <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                        <span className="text-sm font-medium text-slate-600">ADK Agent ingesting document...</span>
                        </div>
                    </div>
                    )}
                    <textarea className="flex-1 w-full p-4 border border-slate-200 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50" placeholder="Content will appear here after upload..." value={text} onChange={(e) => setText(e.target.value)}></textarea>
                </div>
                <div className="flex-1 flex flex-col min-h-0 border-l border-slate-100 pl-0 lg:pl-6">
                    <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Extracted Rules</label>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{extractedRules.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto bg-slate-50 rounded-lg border border-slate-200 p-3 space-y-2">
                    {extractedRules.map((rule, idx) => (
                        <div key={idx} className="flex gap-3 text-sm text-slate-700 bg-white p-2.5 rounded border border-slate-100 shadow-sm">
                        <span className="text-blue-500 font-bold text-xs mt-0.5">{idx + 1}</span>
                        <span>{rule}</span>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            ) : (
                <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden flex flex-col">
                    {isVerifying ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                             <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-500" />
                             <p>Consulting Google Search for regulations...</p>
                        </div>
                    ) : !verificationResult ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <Globe className="w-12 h-12 mb-3 opacity-20" />
                            <p>Click "Verify with Search" to check this policy against live web data.</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center">
                                    <ShieldCheck className="w-4 h-4 mr-2 text-indigo-600" /> AI Verification Summary
                                </h3>
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {verificationResult.summary}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center">
                                    <ExternalLink className="w-4 h-4 mr-2 text-indigo-600" /> Cited Sources
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {verificationResult.sources.map((source, idx) => (
                                        <a 
                                            key={idx} 
                                            href={source.uri} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex items-center p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-sm transition-all text-sm group"
                                        >
                                            <div className="bg-indigo-50 text-indigo-600 w-6 h-6 rounded flex items-center justify-center text-xs font-bold mr-3 group-hover:bg-indigo-100">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-800 truncate">{source.title}</p>
                                                <p className="text-xs text-slate-500 truncate">{source.uri}</p>
                                            </div>
                                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
              <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center shadow-lg shadow-blue-500/20 transition-all font-medium">
                <Save className="w-4 h-4 mr-2" />
                Save Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyManager;
