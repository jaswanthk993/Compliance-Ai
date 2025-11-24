
import React, { useState, useEffect, useRef } from 'react';
import { Policy, ChatMessage } from '../types';
import { ADKOrchestrator } from '../services/agentSystem';
import { Send, User, Bot, Info, BrainCircuit, Trash2, Sparkles, MessageCircle } from 'lucide-react';

interface ChatInterfaceProps {
  activePolicy: Policy | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ activePolicy }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load chat history and generate suggestions
  useEffect(() => {
    if (activePolicy) {
      const storedHistory = sessionStorage.getItem(`chat_history_${activePolicy.id}`);
      if (storedHistory) {
        try {
          setMessages(JSON.parse(storedHistory));
        } catch (e) {
          initChat();
        }
      } else {
        initChat();
      }

      // Generate simple suggestions from rules
      if (activePolicy.rules && activePolicy.rules.length > 0) {
        const randomRules = [...activePolicy.rules].sort(() => 0.5 - Math.random()).slice(0, 3);
        setSuggestions(randomRules.map(r => `What is the rule about ${r.split(' ').slice(0, 3).join(' ')}?`));
      }
    } else {
      setMessages([]);
      setSuggestions([]);
    }
  }, [activePolicy]);

  // Sync to SessionStorage
  useEffect(() => {
    if (activePolicy && messages.length > 0) {
      sessionStorage.setItem(`chat_history_${activePolicy.id}`, JSON.stringify(messages));
    }
  }, [messages, activePolicy]);

  const initChat = () => {
    if (activePolicy) {
      setMessages([{ 
        id: 'init', 
        role: 'model', 
        text: `Hello! I am your RAG-powered Policy Assistant for "${activePolicy.title}".\n\nI can help you understand compliance requirements, check specific rules, or clarify procedures. What would you like to know?`, 
        timestamp: new Date() 
      }]);
    }
  };

  const handleClearChat = () => {
    if (activePolicy && window.confirm("Are you sure you want to clear this chat history?")) {
      sessionStorage.removeItem(`chat_history_${activePolicy.id}`);
      initChat();
    }
  };

  const handleSend = async (textOverride?: string) => {
    if (!activePolicy) return;
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    setInput('');
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Filter out internal init messages for the API context
      const apiHistory = messages.filter(m => m.id !== 'init').map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await ADKOrchestrator.queryRag(
        apiHistory, 
        textToSend, 
        { sessionId: 'chat-session', activePolicy }
      );
      
      const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm sorry, I'm having trouble connecting to the Knowledge Base right now.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!activePolicy) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Select a Policy</h2>
          <p className="text-slate-500 mb-6">The Policy Assistant needs a context to operate. Please select a policy from the Policy Management tab.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen p-6 bg-slate-50 animate-in fade-in duration-500">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
            Policy Assistant
          </h1>
          <p className="text-sm text-slate-500 ml-8">Context: <span className="font-semibold text-blue-700">{activePolicy.title}</span></p>
        </div>
        <div className="flex items-center gap-3">
            {activePolicy.isIndexed ? (
            <div className="bg-green-100 text-green-800 text-xs px-3 py-1.5 rounded-full flex items-center border border-green-200 shadow-sm">
                <BrainCircuit className="w-3 h-3 mr-1" />
                RAG Active
            </div>
            ) : (
            <div className="bg-amber-100 text-amber-800 text-xs px-3 py-1.5 rounded-full flex items-center border border-amber-200 animate-pulse">
                <Info className="w-3 h-3 mr-1" />
                Training Required
            </div>
            )}
            <button 
                onClick={handleClearChat}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Clear Chat History"
            >
                <Trash2 size={18} />
            </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden relative">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'user' ? 'bg-blue-600 text-white ml-3' : 'bg-emerald-600 text-white mr-3'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="flex flex-col">
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
                    }`}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                    </div>
                    <span className={`text-[10px] text-slate-400 mt-1 ${msg.role === 'user' ? 'text-right mr-1' : 'ml-1'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
               <div className="flex items-center space-x-2 bg-slate-50 px-4 py-3 rounded-2xl rounded-tl-none ml-11 border border-slate-100">
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-100 bg-white">
            
          {/* Suggestions */}
          {messages.length < 3 && suggestions.length > 0 && (
             <div className="mb-4 flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                    <button 
                        key={i}
                        onClick={() => handleSend(s)}
                        disabled={!activePolicy.isIndexed}
                        className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-colors cursor-pointer"
                    >
                        {s}
                    </button>
                ))}
             </div>
          )}

          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={activePolicy.isIndexed ? "Ask about compliance rules, procedures, or penalties..." : "Train this policy first..."}
              disabled={!activePolicy.isIndexed}
              className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping || !activePolicy.isIndexed}
              className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
