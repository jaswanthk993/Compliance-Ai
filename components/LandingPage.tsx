
import React from 'react';
import { ArrowRight, Zap, ShieldCheck, Clock, BrainCircuit, Activity, BarChart3, AlertCircle, ChevronRight } from 'lucide-react';

interface LandingPageProps {
  onExplore: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onExplore }) => {
  return (
    <div className="flex flex-col animate-in fade-in duration-700 bg-white">
      {/* Hero Section */}
      <section className="bg-slate-950 text-white py-24 md:py-32 px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[140px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-600 rounded-full blur-[140px]"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-900/40 backdrop-blur-md border border-blue-500/30 px-5 py-1.5 rounded-full text-xs font-bold mb-10 shadow-lg shadow-blue-500/10">
            <SparkleIcon className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-100 tracking-wide uppercase">Powered by Google Gemini AI</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05]">
            Automate Compliance. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">Eliminate Risk. Save Lives.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Next-generation workplace safety intelligence. Detect violations instantly, prevent incidents, and transform compliance workflows with multimodal AI.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onExplore}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl shadow-blue-600/30 flex items-center justify-center transition-all group active:scale-95"
            >
              Start Free Trial <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform w-6 h-6" />
            </button>
            <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 px-10 py-5 rounded-2xl font-bold text-xl transition-all flex items-center justify-center group">
              Explore Features <ChevronRight className="ml-2 w-5 h-5 text-slate-500 group-hover:text-white" />
            </button>
          </div>
          
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/10 pt-16">
            {[
              { val: '90%', label: 'Time Saved' },
              { val: '75%', label: 'Fewer Incidents' },
              { val: '3x', label: 'Faster Audits' },
              { val: '15+', label: 'Industries Served' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl md:text-5xl font-black mb-2 text-white group-hover:text-blue-400 transition-colors">{stat.val}</div>
                <div className="text-slate-500 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 px-8 bg-white text-center">
        <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Manual Compliance Is Broken</h2>
            <p className="text-xl text-slate-500 font-medium">Traditional compliance processes are slow, inconsistent, and prone to catastrophic human error.</p>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: Clock, title: 'Time-Consuming Reviews', color: 'text-amber-500', bg: 'bg-amber-50', desc: 'Safety officers spend 40% of their time reading documents instead of being on-site.' },
            { icon: AlertCircle, title: 'Human Error', color: 'text-red-500', bg: 'bg-red-50', desc: 'Inconsistent evaluations lead to missed hazards and severe regulatory penalties.' },
            { icon: BarChart3, title: 'Delayed Response', color: 'text-blue-500', bg: 'bg-blue-50', desc: 'Violations are often found weeks after they occur, too late to prevent incidents.' },
          ].map((item, i) => (
            <div key={i} className="group p-10 rounded-[40px] border border-slate-100 bg-white hover:border-blue-100 hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.1)] transition-all duration-500 text-left">
              <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">{item.title}</h3>
              <p className="text-slate-600 text-lg leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Intelligent Automation</h2>
            <p className="text-xl text-slate-500">Multimodal intelligence tailored for compliance excellence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: 'Instant Policy Analysis', desc: 'Upload SOPs and get immediate rule extraction and gap analysis.' },
              { icon: Activity, title: 'Automated Image Inspection', desc: 'Detect PPE missing, safety violations, and environmental hazards via vision AI.' },
              { icon: ShieldCheck, title: 'Real-time Violation Detection', desc: 'Continuous monitoring that flags safety issues before they escalate.' },
              { icon: BarChart3, title: 'Intelligent Risk Scoring', desc: 'Advanced algorithms prioritize your most critical compliance gaps.' },
            ].map((feat, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-left hover:shadow-xl transition-shadow group">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                  <feat.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feat.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-32 px-8 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-20">Four Simple Steps to Safety</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[1px] bg-slate-100 z-0"></div>
            {[
              { step: '01', title: 'Upload Evidence', desc: 'Policy docs, CCTV frames, or log files.' },
              { step: '02', title: 'AI Analysis', desc: 'Gemini 2.5 extracts rules and detects violations.' },
              { step: '03', title: 'Risk Assessment', desc: 'Automated scoring based on severity.' },
              { step: '04', title: 'Instant Report', desc: 'Actionable summaries for stakeholders.' },
            ].map((s, i) => (
              <div key={i} className="relative flex flex-col items-center z-10">
                <div className="w-20 h-20 bg-white border-4 border-slate-50 text-blue-600 rounded-full flex items-center justify-center text-2xl font-black mb-8 shadow-xl">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-500 max-w-[200px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8 bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500 rounded-full blur-[150px]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to Transform Your Workflow?</h2>
            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">Make workplaces safer, audits faster, and compliance automatic today.</p>
            <button 
            onClick={onExplore}
            className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-bold text-2xl transition-all shadow-2xl shadow-blue-600/40 active:scale-95 group flex items-center mx-auto"
            >
            Get Started Now <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform w-8 h-8" />
            </button>
        </div>
      </section>
    </div>
  );
};

const SparkleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
    </svg>
);

export default LandingPage;
