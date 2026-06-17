
import React from 'react';
import { Target, Eye, Shield, Lightbulb, Users, Award, Calendar, CheckCircle, ArrowRight } from 'lucide-react';

const AboutPage: React.FC = () => {
  const values = [
    { icon: Shield, title: 'Safety First', desc: 'Every decision we make prioritizes the safety and well-being of workers.' },
    { icon: Lightbulb, title: 'Innovation', desc: 'Leveraging cutting-edge AI to solve real-world compliance challenges.' },
    { icon: Users, title: 'Partnership', desc: 'Working closely with our customers to understand and meet their needs.' },
    { icon: Award, title: 'Excellence', desc: 'Committed to delivering the highest quality compliance solutions.' },
  ];

  const timeline = [
    { year: '2023', text: 'Company founded by compliance and AI experts' },
    { year: '2023', text: 'First AI compliance model deployed' },
    { year: '2024', text: 'Expanded to 4 major industries' },
    { year: '2024', text: 'Powered by Google Gemini AI' },
  ];

  const experts = [
    { name: 'Safety Engineering', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=300' },
    { name: 'AI Development', img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=300' },
    { name: 'Industrial Safety', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=300' },
    { name: 'Quality Assurance', img: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=300' },
    { name: 'Construction Safety', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=300' },
    { name: 'PPE Compliance', img: 'https://images.unsplash.com/photo-1590483736622-39da8af74032?auto=format&fit=crop&q=80&w=300' },
    { name: 'Healthcare Safety', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=300' },
    { name: 'Medical Compliance', img: 'https://images.unsplash.com/photo-1584982751601-97d8c4b5a83b?auto=format&fit=crop&q=80&w=300' },
  ];

  return (
    <div className="animate-in fade-in duration-700 bg-white">
      {/* Header */}
      <section className="bg-slate-950 text-white py-24 md:py-32 px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[140px]"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">About AI Compliance Copilot</h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium">Transforming workplace safety through intelligent automation</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-500">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><Target size={40} /></div>
          <h2 className="text-3xl font-black mb-6 text-slate-900">Our Mission</h2>
          <p className="text-slate-500 text-lg leading-relaxed">To revolutionize workplace safety through AI-powered compliance automation, making workplaces safer and compliance effortless for every organization.</p>
        </div>
        <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-500">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><Eye size={40} /></div>
          <h2 className="text-3xl font-black mb-6 text-slate-900">Our Vision</h2>
          <p className="text-slate-500 text-lg leading-relaxed">A world where every workplace operates at the highest safety standards, powered by intelligent automation that predicts and prevents risks before they occur.</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-8 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-12 text-slate-900">Our Story</h2>
          <div className="bg-blue-50/50 p-12 rounded-[40px] border border-blue-100 leading-relaxed text-slate-700 text-xl font-medium shadow-sm">
            Founded by safety professionals and AI experts, AI Compliance Copilot was born from firsthand experience with the challenges of manual compliance processes. We witnessed too many preventable incidents and knew there had to be a better way to protect workers using the power of multimodal AI.
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-20 text-slate-900">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <div key={i} className="bg-white p-10 rounded-[30px] border border-slate-100 text-center hover:border-blue-100 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner"><v.icon size={28} /></div>
              <h3 className="text-xl font-bold mb-4 text-slate-900">{v.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-24 px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-20 text-slate-900">Our Journey</h2>
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div key={i} className="flex items-center space-x-6 group">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
                  {item.year}
                </div>
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built by Experts Grid */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-20 text-slate-900">Built by Experts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {experts.map((exp, i) => (
            <div key={i} className="group h-48 rounded-3xl overflow-hidden relative shadow-lg">
              <img src={exp.img} alt={exp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/10 to-transparent flex items-end p-6">
                <span className="text-white font-black text-sm tracking-tight">{exp.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 px-8 bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600 rounded-full blur-[150px]"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Join Us in Making Workplaces Safer</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">Partner with us to transform your compliance operations and protect your most valuable assets: your people.</p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-blue-600/30 group flex items-center mx-auto active:scale-95">
            Get in Touch <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
