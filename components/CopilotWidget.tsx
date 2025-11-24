
import React, { useState, useEffect, useRef } from 'react';
import { Policy, ChatMessage } from '../types';
import { ADKOrchestrator } from '../services/agentSystem';
import { MessageSquare, X, Send, Minimize2, Maximize2, Sparkles, BrainCircuit } from 'lucide-react';

interface CopilotWidgetProps {
  activePolicy: Policy | null;
}

const CopilotWidget: React.FC<CopilotWidgetProps> = ({ activePolicy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  // Sync with Session Storage (Same key as ChatInterface for continuity)
  useEffect(() => {
    if (activePolicy) {
      const key = `chat_history_${activePolicy.id}`;
      const stored = sessionStorage.getItem(key);
      if (stored) {
        try {
          setMessages(JSON.parse(stored));
        } catch (e) { console.error(e); }
      } else {
        setMessages([{
          id: 'init',
          role: 'model',
          text: `Hi! I'm your Copilot for "${activePolicy.title}". How can I help?`,
          timestamp: new Date()
        }]);
      }
    } else {
      setMessages([{
        id: 'no-policy',
        role: 'model',
        text: "I'm ready to help! Please select a policy in 'Policy Management' to start a context-aware session.",
        timestamp: new Date()
      }]);
    }
  }, [activePolicy, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !activePolicy?.isIndexed) return;
    
    const userText = input;
    setInput('');
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: userText, timestamp: new Date() };
    
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    sessionStorage.setItem(`chat_history_${activePolicy.id}`, JSON.stringify(newMessages));
    
    setIsTyping(true);

    try {
      const apiHistory = newMessages.filter(m => m.id !== 'init' && m.id !== 'no-policy').map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await ADKOrchestrator.queryRag(
        apiHistory, 
        userText, 
        { sessionId: 'widget-session', activePolicy }
      );

      const modelMsg: ChatMessage = { id: (Date.now()+1).toString(), role: 'model', text: responseText, timestamp: new Date() };
      const updatedMessages = [...newMessages, modelMsg];
      setMessages(updatedMessages);
      sessionStorage.setItem(`chat_history_${activePolicy.id}`, JSON.stringify(updatedMessages));
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-white w-[350px] h-[500px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Compliance Copilot</h3>
                {activePolicy && (
                    <p className="text-[10px] text-slate-300 truncate max-w-[150px]">{activePolicy.title}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                    <Minimize2 size={16} />
                </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={activePolicy?.isIndexed ? "Ask a question..." : "Select a policy first..."}
                    disabled={!activePolicy?.isIndexed || isTyping}
                    className="w-full pl-4 pr-10 py-3 bg-slate-100 border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || !activePolicy?.isIndexed}
                    className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    <Send size={14} />
                </button>
            </div>
            {!activePolicy?.isIndexed && activePolicy && (
                <div className="mt-2 text-[10px] text-center text-amber-600 flex items-center justify-center bg-amber-50 p-1 rounded">
                    <BrainCircuit size={10} className="mr-1" /> Training Required in Policy Manager
                </div>
            )}
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-xl transition-all transform hover:scale-105 flex items-center justify-center ${
          isOpen ? 'bg-slate-200 text-slate-600 rotate-90' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default CopilotWidget;
