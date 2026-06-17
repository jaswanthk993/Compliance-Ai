import React from 'react';
import { Check, ArrowRight, Minus, Zap } from 'lucide-react';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Starter',
      desc: 'Perfect for small teams getting started with AI compliance.',
      price: 'Contact Sales',
      features: ['Up to 100 analyses per month', 'Image-based violation detection', 'Basic policy document analysis', 'Email support', 'Standard risk scoring'],
    },
    {
      name: 'Professional',
      desc: 'Advanced features for growing organizations.',
      price: 'Contact Sales',
      popular: true,
      features: ['Unlimited analyses', 'Advanced AI detection models', 'Custom policy integration', 'Priority support (24/7)', 'Advanced risk analytics', 'Real-time violation alerts', 'API access', 'Team collaboration tools'],
    },
    {
      name: 'Enterprise',
      desc: 'Complete solution for large-scale operations.',
      price: 'Custom',
      features: ['Everything in Professional', 'Dedicated account manager', 'Custom AI model training', 'On-premise deployment option', 'Advanced audit trails', 'Multi-facility management', 'SLA guarantees', 'White-label options'],
    },
  ];

  const faqs = [
      { q: "Can I switch plans later?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately." },
      { q: "What payment methods do you accept?", a: "We accept all major credit cards, bank transfers, and can arrange invoicing for enterprise customers." },
      { q: "Is there a free trial?", a: "Yes! Contact our sales team to arrange a 14-day free trial with full access to Professional features." },
      { q: "Do you offer custom pricing for large organizations?", a: "Absolutely. Our Enterprise plan is fully customizable. Contact us to discuss your specific needs." }
  ];

  return (
    <div className="py-24 px-8 bg-white animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto text-center mb-24">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-xl text-slate-500 font-medium">Choose the plan that fits your organization's compliance needs. All plans include core AI features.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-32 items-stretch">
        {plans.map((plan, i) => (
          <div key={i} className={`p-10 rounded-[40px] border flex flex-col ${plan.popular ? 'border-emerald-500 shadow-2xl scale-105 relative bg-white z-10' : 'border-slate-100 bg-slate-50/50'}`}>
            {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">Most Popular</div>}
            
            <div className="mb-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.popular ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    <PriceIcon name={plan.name} />
                </div>
                <h3 className="text-3xl font-black mb-3">{plan.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">{plan.desc}</p>
                <div className="text-4xl font-black text-slate-900">{plan.price}</div>
            </div>

            <button className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center mb-10 transition-all hover:scale-[1.02] active:scale-95 ${plan.popular ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/30' : 'bg-blue-600 text-white shadow-xl shadow-blue-600/30'}`}>
              Get Started <ArrowRight className="ml-3 w-5 h-5" />
            </button>
            
            <div className="space-y-5 flex-1">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">What's included:</div>
              {plan.features.map((f, j) => (
                <div key={j} className="flex items-start text-sm font-bold text-slate-700">
                  <Check className={`w-5 h-5 mr-4 flex-shrink-0 ${plan.popular ? 'text-emerald-500' : 'text-blue-500'}`} />
                  {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ROI Calculator */}
      <div className="max-w-6xl mx-auto mb-32 text-center">
         <h2 className="text-4xl font-black text-slate-900 mb-6">Calculate Your ROI</h2>
         <p className="text-xl text-slate-500 mb-16 font-medium">See how much time and money you can save with AI Compliance Copilot</p>
         
         <div className="bg-slate-50 p-10 md:p-16 rounded-[60px] border border-slate-100 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left relative z-10">
                <div className="bg-white p-10 rounded-3xl shadow-sm">
                    <h4 className="font-black mb-6 text-slate-400 uppercase text-xs tracking-widest">Traditional Manual Process</h4>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center py-4 border-b border-slate-50">
                            <span className="text-slate-600 font-bold">Average review time:</span> 
                            <span className="font-black text-slate-900 text-lg">4 hours</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-slate-50">
                            <span className="text-slate-600 font-bold">Human error rate:</span> 
                            <span className="font-black text-slate-900 text-lg text-red-500">15-20%</span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                            <span className="text-slate-600 font-bold">Monthly cost:</span> 
                            <span className="font-black text-slate-900 text-lg">$8,000+</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-10 rounded-3xl shadow-xl border-2 border-emerald-100">
                    <h4 className="font-black mb-6 text-emerald-500 uppercase text-xs tracking-widest">With AI Compliance Copilot</h4>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center py-4 border-b border-slate-50">
                            <span className="text-slate-600 font-bold">Average review time:</span> 
                            <span className="font-black text-emerald-600 text-2xl">24 minutes</span>
                        </div>
                        <div className="flex justify-between items-center py-4 border-b border-slate-50">
                            <span className="text-slate-600 font-bold">Human error rate:</span> 
                            <span className="font-black text-emerald-600 text-2xl">&lt;1%</span>
                        </div>
                        <div className="flex justify-between items-center py-4">
                            <span className="text-slate-600 font-bold">Monthly savings:</span> 
                            <span className="font-black text-emerald-600 text-2xl">$6,000+</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-16 bg-white p-8 rounded-full border border-emerald-100 inline-flex items-center space-x-10 px-16 shadow-lg relative z-10">
                <div className="text-4xl font-black text-slate-900">Average ROI: <span className="text-emerald-500">350%</span></div>
                <div className="h-10 w-[1px] bg-slate-100 hidden sm:block"></div>
                <p className="text-slate-500 font-bold hidden sm:block">Most customers see full ROI within 3 months</p>
            </div>
         </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mb-32">
        <h2 className="text-4xl font-black text-slate-900 text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-6">
            {faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors group">
                    <h4 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{faq.q}</h4>
                    <p className="text-slate-600 font-medium leading-relaxed">{faq.a}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Final CTA in Pricing */}
      <div className="bg-slate-950 rounded-[60px] py-20 px-8 text-center text-white">
          <h2 className="text-4xl font-black mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-slate-400 mb-10 font-medium">Contact our team for a personalized demo and pricing quote.</p>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-2xl shadow-blue-600/20">Contact Sales</button>
      </div>
    </div>
  );
};

// Fixed: Added missing 'Zap' icon import from lucide-react
const PriceIcon = ({ name }: { name: string }) => {
    switch (name) {
        case 'Starter': return <Zap className="w-8 h-8" />;
        case 'Professional': return <Check className="w-8 h-8" />;
        case 'Enterprise': return <ArrowRight className="w-8 h-8" />;
        default: return <Zap className="w-8 h-8" />;
    }
}

export default PricingPage;