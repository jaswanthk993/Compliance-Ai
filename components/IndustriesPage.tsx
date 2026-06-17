
import React from 'react';
import { Factory, HardHat, Truck, Stethoscope, Zap, Cpu, ShoppingCart, Landmark, Plane, Anchor, TestTube, Microscope, Globe, CheckCircle } from 'lucide-react';

const IndustriesPage: React.FC = () => {
  const industries = [
    { 
        title: 'Manufacturing & Industrial Plants', 
        icon: Factory, 
        color: 'bg-blue-600', 
        img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
        features: ['Floor safety protocols', 'Equipment maintenance tracking', 'Hazardous material handling', 'Machine guarding verification'] 
    },
    { 
        title: 'Construction & Infrastructure', 
        icon: HardHat, 
        color: 'bg-orange-600', 
        img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400',
        features: ['PPE verification', 'Heavy equipment compliance', 'Excavation safety', 'Emergency response planning'] 
    },
    { 
        title: 'Logistics & Warehousing', 
        icon: Truck, 
        color: 'bg-purple-600', 
        img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400',
        features: ['Loading dock safety', 'Forklift operation compliance', 'Racking stability assessments', 'Ergonomic lifting enforcement'] 
    },
    { 
        title: 'Healthcare & Hospitals', 
        icon: Stethoscope, 
        color: 'bg-red-600', 
        img: 'https://images.unsplash.com/photo-1586773860418-d3b9a8ec8172?auto=format&fit=crop&q=80&w=400',
        features: ['Infection control protocols', 'Patient privacy (HIPAA)', 'Sharps disposal tracking', 'Sanitation standards adherence'] 
    },
    { 
        title: 'Energy, Oil & Gas, Utilities', 
        icon: Zap, 
        color: 'bg-teal-600', 
        img: 'https://images.unsplash.com/photo-1466611653911-954ff21b6748?auto=format&fit=crop&q=80&w=400',
        features: ['Hazardous area classification', 'Shutdown procedure audits', 'Environmental impact assessments', 'Contractor safety management'] 
    },
    { 
        title: 'Automotive & Heavy Engineering', 
        icon: Cpu, 
        color: 'bg-slate-700', 
        img: 'https://images.unsplash.com/photo-1530124560676-587cad31296a?auto=format&fit=crop&q=80&w=400',
        features: ['Assembly line ergonomics', 'Robotic cell safety', 'Welding and fumes compliance', 'Quality control integration'] 
    },
    { 
        title: 'Food Processing & FMCG', 
        icon: ShoppingCart, 
        color: 'bg-green-600', 
        img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=400',
        features: ['HACCP compliance monitoring', 'Allergen control verification', 'Temperature control audits', 'Hygiene and sanitation tracking'] 
    },
    { 
        title: 'Corporate Enterprises & IT', 
        icon: Globe, 
        color: 'bg-indigo-600', 
        img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400',
        features: ['Ergonomic workstations', 'Electrical safety inspections', 'Data center safety protocols', 'Emergency preparedness training'] 
    },
  ];

  const gridIndustries = [
      { name: 'CNC Operations', img: 'https://images.unsplash.com/photo-1565153907400-7e01a9ab25f3?auto=format&fit=crop&q=80&w=200' },
      { name: 'Machine Safety', img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=200' },
      { name: 'Welding Safety', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=200' },
      { name: 'Industrial Work', img: 'https://images.unsplash.com/photo-1531834685032-c74696a6b4e1?auto=format&fit=crop&q=80&w=200' },
      { name: 'Site Planning', img: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=200' },
      { name: 'Safety Gear', img: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=200' },
      { name: 'Lab Safety', img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=200' },
      { name: 'Medical Teams', img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=200' },
  ];

  return (
    <div className="py-24 px-8 bg-white animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto text-center mb-24">
        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Industries We Transform</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">Tailored AI compliance solutions across 15+ industries, backed by sector-specific expertise and regulatory knowledge.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-32">
        {industries.map((ind, i) => (
          <div key={i} className="group flex flex-col bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="h-48 overflow-hidden relative">
                <img src={ind.img} alt={ind.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/0 transition-colors"></div>
                <div className={`absolute bottom-4 left-4 w-12 h-12 ${ind.color} text-white rounded-2xl flex items-center justify-center shadow-xl`}>
                    <ind.icon size={24} />
                </div>
            </div>
            <div className="p-8 flex-1">
                <h3 className="text-xl font-black text-slate-900 mb-6 group-hover:text-blue-600 transition-colors leading-tight">{ind.title}</h3>
                <div className="space-y-3">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Compliance Features</p>
                    {ind.features.map((feat, j) => (
                        <div key={j} className="flex items-center text-xs font-bold text-slate-600">
                            <CheckCircle size={14} className="mr-2 text-blue-500 flex-shrink-0" />
                            {feat}
                        </div>
                    ))}
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto text-center mb-32">
        <h2 className="text-3xl font-black text-slate-900 mb-16 uppercase tracking-[0.2em]">Compliance Across All Workplaces</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {gridIndustries.map((g, i) => (
                <div key={i} className="group h-40 rounded-3xl overflow-hidden relative shadow-lg">
                    <img src={g.img} alt={g.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex items-end p-5">
                        <span className="text-white text-sm font-black tracking-tight">{g.name}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="bg-slate-950 rounded-[60px] p-20 text-center text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-10">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[100px]"></div>
         </div>
         <h2 className="text-4xl font-black mb-8 relative z-10">Ready to Transform Your Industry?</h2>
         <p className="text-xl text-slate-400 mb-12 max-w-xl mx-auto font-medium relative z-10">Get a customized demo for your specific industry compliance needs.</p>
         <button className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-blue-600/20 relative z-10 active:scale-95">Schedule Industry Demo</button>
      </div>
    </div>
  );
};

export default IndustriesPage;
