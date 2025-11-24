import React, { useState, useRef } from 'react';
import { Policy, AnalysisResult, RiskLevel } from '../types';
import { ADKOrchestrator } from '../services/agentSystem';
import { Upload, Camera, Loader2, AlertTriangle, CheckCircle, Info, ShieldCheck, AlertCircle, FileWarning, FileSpreadsheet, PlayCircle, ArrowRight, ImagePlus, FileUp } from 'lucide-react';

interface EvidenceAnalyzerProps {
  activePolicy: Policy | null;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

const EvidenceAnalyzer: React.FC<EvidenceAnalyzerProps> = ({ activePolicy, onAnalysisComplete }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'log'>('visual');
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [logText, setLogText] = useState<string>('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>(''); // For visual feedback of ADK steps
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setImageName(file.name);
        setCurrentResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!activePolicy) return;
    if (activeTab === 'visual' && !image) return;
    if (activeTab === 'log' && !logText) return;

    setIsAnalyzing(true);
    
    // Simulate Workflow Steps for Demo visual
    setAnalysisStep('Uploading to Cloud Storage...');
    await new Promise(r => setTimeout(r, 800));
    setAnalysisStep('Invoking Cloud Run Endpoint...');
    await new Promise(r => setTimeout(r, 600));
    setAnalysisStep('ADK Agent: Running Gemini Analysis...');
    
    try {
      let response;
      if (activeTab === 'visual' && image) {
        const base64Data = image.split(',')[1];
        response = await ADKOrchestrator.analyzeEvidence(
            { sessionId: 'session-1', activePolicy },
            { type: 'image', data: base64Data, filename: imageName || 'evidence.jpg' }
        );
      } else {
        response = await ADKOrchestrator.analyzeEvidence(
            { sessionId: 'session-1', activePolicy },
            { type: 'log', data: logText }
        );
      }

      setAnalysisStep('Saving Results to BigQuery...');
      await new Promise(r => setTimeout(r, 500));

      if (response.success && response.data) {
        setCurrentResult(response.data);
        onAnalysisComplete(response.data);
      } else {
        alert("Compliance Agent failed: " + response.message);
      }
    } catch (error) {
      alert("Analysis failed.");
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const loadSampleLog = () => {
     if (!activePolicy) return;
     let sample = "";
     
     switch(activePolicy.industry) {
         case 'Finance':
             sample = "TXN_ID,DATE,AMOUNT,SENDER,BENEFICIARY,COUNTRY\nTX9823,2023-10-12,9500,ACME Corp,Shell LLC,USA\nTX9824,2023-10-12,12000,John Doe,Crypto Exchange,Cayman Islands\nTX9825,2023-10-13,4500,Tech Solutions,Parts Co,Germany";
             break;
         case 'Healthcare':
             sample = "TIMESTAMP,STAFF_ID,ACTION,ROOM,NOTES\n08:00,RN-45,Entry,204,Sanitized hands\n08:15,RN-45,Vitals,204,Gloves worn\n08:45,DR-12,Incision,204,Forgot sterile field check\n09:00,RN-45,Waste,204,Sharps bin overfilled";
             break;
         case 'Retail':
             sample = "TIME,UNIT_ID,TEMP_C,CHECKED_BY\n09:00,Fridge-A,3.5,Manager\n10:00,Fridge-A,4.0,Manager\n11:00,Fridge-A,8.2,Staff (Alert: High Temp)\n12:00,Fridge-A,3.8,Manager";
             break;
         case 'Logistics':
             sample = "TRUCK_ID,DOCK,TIME,CHOCKS_SET,DOOR_LOCKED\nTR-55,Dock-1,14:00,YES,YES\nTR-56,Dock-2,14:15,NO,NO\nTR-57,Dock-1,15:00,YES,YES";
             break;
         default:
             sample = "LOG_ID,EVENT,STATUS\n001,System Start,OK\n002,Safety Check,FAILED\n003,Manual Override,DETECTED";
     }
     setLogText(sample);
  };

  const getSeverityStyles = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.CRITICAL: return { 
        wrapper: 'border-l-red-600 bg-red-50 border-red-100', 
        badge: 'bg-red-600 text-white', 
        text: 'text-red-900', 
        icon: <AlertTriangle className="w-5 h-5 text-red-600" /> 
      };
      case RiskLevel.HIGH: return { 
        wrapper: 'border-l-orange-500 bg-orange-50 border-orange-100', 
        badge: 'bg-orange-500 text-white', 
        text: 'text-orange-900', 
        icon: <AlertCircle className="w-5 h-5 text-orange-500" /> 
      };
      case RiskLevel.MEDIUM: return { 
        wrapper: 'border-l-amber-500 bg-amber-50 border-amber-100', 
        badge: 'bg-amber-500 text-white', 
        text: 'text-amber-900', 
        icon: <FileWarning className="w-5 h-5 text-amber-600" /> 
      };
      default: return { 
        wrapper: 'border-l-blue-500 bg-blue-50 border-blue-100', 
        badge: 'bg-blue-500 text-white', 
        text: 'text-blue-900', 
        icon: <Info className="w-5 h-5 text-blue-600" /> 
      };
    }
  };

  const getRiskLevelColor = (level: RiskLevel) => {
      switch (level) {
        case RiskLevel.CRITICAL: return 'bg-red-100 text-red-700 border-red-200';
        case RiskLevel.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
        case RiskLevel.MEDIUM: return 'bg-amber-100 text-amber-700 border-amber-200';
        default: return 'bg-blue-100 text-blue-700 border-blue-200';
      }
  };

  if (!activePolicy) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <Info className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Active Policy Context</h2>
          <p className="text-slate-500">The Compliance Agent needs a policy to check against. Select or Create one in Policy Management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Evidence Analysis</h1>
          <p className="text-slate-500 mt-2">Active Context: <span className="font-semibold text-blue-600">{activePolicy.title}</span></p>
        </div>
      </div>

      <div className="flex space-x-4 mb-6 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('visual')}
            className={`pb-3 px-1 flex items-center font-medium transition-colors border-b-2 ${activeTab === 'visual' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
              <Camera className="w-4 h-4 mr-2" />
              Visual Inspection (Image)
          </button>
          <button 
            onClick={() => setActiveTab('log')}
            className={`pb-3 px-1 flex items-center font-medium transition-colors border-b-2 ${activeTab === 'log' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Log Analysis (Text/CSV)
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          
          {activeTab === 'visual' ? (
              <div className="flex flex-col h-[400px]">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-slate-600">Upload Site Photo / CCTV Frame</label>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs flex items-center bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 px-3 py-1.5 rounded-md transition-all shadow-sm font-medium"
                    >
                        <FileUp className="w-3.5 h-3.5 mr-1.5" />
                        Upload Evidence
                    </button>
                </div>
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                />

                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-8 relative overflow-hidden ${
                        image ? 'border-blue-300 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400'
                    }`}
                >
                    {image ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                             <img src={image} alt="Evidence" className="max-w-full max-h-full object-contain rounded-lg shadow-sm" />
                             <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center group">
                                <div className="opacity-0 group-hover:opacity-100 bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-slate-700 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                                    Change Image
                                </div>
                             </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                <Upload size={32} />
                            </div>
                            <p className="text-sm font-medium text-slate-700">Click to upload or drag and drop</p>
                            <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG (Max 10MB)</p>
                        </>
                    )}
                </div>
                {imageName && <p className="text-xs text-slate-400 text-center mt-2 flex items-center justify-center"><ImagePlus className="w-3 h-3 mr-1"/> {imageName}</p>}
              </div>
          ) : (
            <div className="flex flex-col h-[400px]">
               <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-slate-600">Paste System Logs / CSV</label>
                    <button onClick={loadSampleLog} className="text-xs text-blue-600 hover:underline flex items-center">
                        <PlayCircle className="w-3 h-3 mr-1" />
                        Load {activePolicy.industry || 'Generic'} Sample
                    </button>
               </div>
               <textarea
                value={logText}
                onChange={(e) => setLogText(e.target.value)}
                className="flex-1 w-full p-4 border border-slate-200 rounded-xl font-mono text-xs leading-relaxed resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-900 text-slate-200 shadow-inner"
                placeholder={`TIMESTAMP, EVENT_ID, STATUS, USER\n2023-10-27 08:00:00, EVT_992, SUCCESS, admin\n...`}
               />
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || (activeTab === 'visual' && !image) || (activeTab === 'log' && !logText)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center text-lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin mr-3" size={24} />
                {analysisStep || 'Analyzing...'}
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2" size={24} />
                Run Compliance Check
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[500px] overflow-hidden">
           <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
               <h3 className="font-bold text-slate-700 flex items-center">
                   <ArrowRight className="w-4 h-4 mr-2 text-slate-400" />
                   Analysis Report
               </h3>
               {currentResult && (
                   <span className="text-xs text-slate-400 font-mono">ID: {currentResult.id.slice(-6)}</span>
               )}
           </div>
           
           <div className="flex-1 overflow-y-auto p-6">
                {!currentResult ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <ShieldCheck className="w-16 h-16 mb-4 opacity-20" />
                        <p>Run analysis to view violations & risk score.</p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Overall Risk Level</p>
                                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRiskLevelColor(currentResult.overallRisk)}`}>
                                    {currentResult.overallRisk}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500 mb-1">Compliance Score</p>
                                <div className="flex items-baseline justify-end">
                                    <span className="text-3xl font-bold text-slate-900">{currentResult.score}</span>
                                    <span className="text-slate-400 text-sm">/100</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center">
                                <Info className="w-4 h-4 mr-2" /> Executive Summary
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed bg-white p-3 rounded border border-slate-100 shadow-sm">
                                {currentResult.summary}
                            </p>
                        </div>

                        <div>
                             <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center">
                                <AlertTriangle className="w-4 h-4 mr-2" /> Detected Violations
                            </h4>
                            {currentResult.violations.length === 0 ? (
                                <div className="flex items-center p-4 bg-green-50 text-green-700 rounded-lg border border-green-100">
                                    <CheckCircle className="w-5 h-5 mr-3" />
                                    <span className="font-medium">No violations detected. Compliance verified.</span>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {currentResult.violations.map((violation, idx) => {
                                        const styles = getSeverityStyles(violation.severity);
                                        return (
                                            <div key={idx} className={`p-4 rounded-r-lg border-l-4 shadow-sm bg-white ${styles.wrapper}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {styles.icon}
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${styles.badge}`}>
                                                            {violation.severity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className={`text-sm font-medium mb-3 ${styles.text}`}>{violation.description}</p>
                                                <div className="bg-white/60 p-3 rounded text-xs text-slate-600 border border-black/5">
                                                    <span className="font-bold text-slate-700 block mb-1">Corrective Action:</span>
                                                    {violation.recommendation}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceAnalyzer;