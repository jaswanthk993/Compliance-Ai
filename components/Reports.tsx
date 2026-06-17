
import React, { useState, useEffect, useRef } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { ADKOrchestrator } from '../services/agentSystem';
// Fixed: Added ShieldCheck to lucide-react imports
import { Download, Search, FileText, Filter, Calendar, AlertTriangle, CheckCircle, Eye, RefreshCw, Database, Table, HardDrive, MoreHorizontal, Info, Trash2, ShieldCheck } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ReportsProps {
  results: AnalysisResult[];
}

const Reports: React.FC<ReportsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'inspector'>('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [history, setHistory] = useState<AnalysisResult[]>(results);
  const [openRowMenu, setOpenRowMenu] = useState<string | null>(null);
  const [dbData, setDbData] = useState<{ spanner: any; mongo: any; sql: any }>({ spanner: [], mongo: 0, sql: 0 });

  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHistory();
    fetchDbStats();

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenRowMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [results, activeTab]);

  const fetchHistory = async () => {
    const data = await ADKOrchestrator.getAuditHistory();
    setHistory(data);
  };

  const fetchDbStats = () => {
      const spannerData = JSON.parse(localStorage.getItem('Spanner_Policies') || '[]');
      const mongoCount = parseInt(localStorage.getItem('Atlas_Vector_Index') || '0');
      const sqlCount = parseInt(localStorage.getItem('Sql_Generic_Data') || '0');
      setDbData({ spanner: spannerData, mongo: mongoCount, sql: sqlCount });
  };

  const filteredResults = history.filter(r => {
    const matchesSearch = 
      r.summary.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.id.includes(searchTerm) ||
      r.evidenceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'ALL' || r.overallRisk === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const generatePDF = (result: AnalysisResult) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Compliance Analysis Report", 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    doc.text(`Report ID: ${result.id}`, 20, 35);
    doc.line(20, 40, 190, 40);
    doc.setFontSize(14);
    doc.text("Executive Summary", 20, 50);
    doc.setFontSize(11);
    doc.text(`Risk: ${result.overallRisk}`, 20, 60);
    doc.text(`Score: ${result.score}/100`, 20, 68);
    const splitSummary = doc.splitTextToSize(result.summary, 170);
    doc.text(splitSummary, 20, 80);
    doc.save(`report-${result.id}.pdf`);
    setOpenRowMenu(null);
  };

  const getRiskBadge = (risk: string) => {
      switch(risk) {
          case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-200';
          case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
          case 'MEDIUM': return 'bg-amber-100 text-amber-700 border-amber-200';
          case 'LOW': return 'bg-green-100 text-green-700 border-green-200';
          default: return 'bg-slate-100 text-slate-700 border-slate-200';
      }
  };

  const toggleRowMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenRowMenu(openRowMenu === id ? null : id);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
            <div>
            <h1 className="text-4xl font-display font-medium text-slate-900 dark:text-white tracking-tight">Ledger & Telemetry</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Audit history and Hybrid Data Layer inspection.</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl">
                <button onClick={() => setActiveTab('audit')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'audit' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>Audit Logs</button>
                <button onClick={() => setActiveTab('inspector')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${activeTab === 'inspector' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}><Database className="w-4 h-4 mr-2" /> Data Inspector</button>
            </div>
        </div>

        {activeTab === 'audit' ? (
            <>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96 group">
                        <button 
                          onClick={() => searchInputRef.current?.focus()}
                          className="absolute left-3 top-2.5 text-slate-400 group-hover:text-blue-500 transition-colors"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                        <input 
                          ref={searchInputRef}
                          type="text" 
                          placeholder="Search logs..." 
                          className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                          value={searchTerm} 
                          onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
                            <option value="ALL">All Risks</option>
                            <option value="CRITICAL">Critical</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>
                        <button onClick={fetchHistory} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 transition-all hover:bg-slate-50"><RefreshCw className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date & ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Evidence</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Risk Level</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Score</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredResults.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">No records matching your search were found.</td></tr>
                                ) : (
                                    filteredResults.map((result) => (
                                        <tr key={result.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800">{new Date(result.timestamp).toLocaleDateString()}</span>
                                                    <span className="text-[10px] text-slate-400 font-mono">#{result.id.slice(-6)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 capitalize text-sm font-medium text-slate-600">{result.evidenceType}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${getRiskBadge(result.overallRisk)}`}>{result.overallRisk}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-sm text-slate-900">{result.score}</td>
                                            <td className="px-6 py-4 text-right relative">
                                                <button 
                                                  onClick={(e) => toggleRowMenu(e, result.id)}
                                                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                                                >
                                                  <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                                </button>
                                                
                                                {openRowMenu === result.id && (
                                                  <div ref={menuRef} className="absolute right-6 top-12 w-44 bg-white border border-slate-200 rounded-xl shadow-2xl z-30 py-1.5 animate-in fade-in zoom-in-95 duration-200">
                                                    <button onClick={() => { setOpenRowMenu(null); alert("Detailed inspection view coming in next update."); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center transition-colors"><Eye className="w-3.5 h-3.5 mr-2.5 text-blue-500" /> View Details</button>
                                                    <button onClick={() => generatePDF(result)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center transition-colors"><Download className="w-3.5 h-3.5 mr-2.5 text-emerald-500" /> Download PDF</button>
                                                    <div className="h-px bg-slate-100 my-1"></div>
                                                    <button onClick={() => { setOpenRowMenu(null); alert("Deletion is currently disabled for audit integrity."); }} className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center transition-colors"><Trash2 className="w-3.5 h-3.5 mr-2.5" /> Archive Log</button>
                                                  </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[550px]">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between"><h3 className="font-bold text-slate-700 flex items-center uppercase text-xs tracking-widest"><Table className="w-4 h-4 mr-2 text-blue-600" />Cloud Spanner Transactions</h3></div>
                    <div className="flex-1 overflow-auto p-4 font-mono text-xs text-blue-400 bg-slate-950 shadow-inner leading-relaxed"><pre className="whitespace-pre-wrap">{JSON.stringify(dbData.spanner, null, 2)}</pre></div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-center justify-between group hover:border-emerald-200 transition-colors">
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">MongoDB Atlas Vector Search</p>
                            <h4 className="text-3xl font-black text-slate-900">{dbData.mongo} Embeddings</h4>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform"><HardDrive className="w-10 h-10" /></div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-center justify-between group hover:border-orange-200 transition-colors">
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Generic SQL Events</p>
                            <h4 className="text-3xl font-black text-slate-900">{dbData.sql} Active Rows</h4>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-2xl text-orange-600 group-hover:scale-110 transition-transform"><Database className="w-10 h-10" /></div>
                    </div>
                    <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="text-lg font-black mb-2">Hybrid Data Layer</h4>
                            <p className="text-blue-100 text-sm leading-relaxed">System automatically routes data to optimized stores based on access patterns and compliance lifecycle stage.</p>
                        </div>
                        <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Reports;
