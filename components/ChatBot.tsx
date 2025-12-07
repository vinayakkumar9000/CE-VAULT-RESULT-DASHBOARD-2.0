import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';
import { MOCK_STUDENTS } from '../mockData';
import { GlassCard } from './GlassComponents';

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'model', text: 'Hi! I can help you check student results, compare marks, or analyze performance. What would you like to know?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: inputValue
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Prepare history for API
        const historyForApi = messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        const responseText = await chatWithAI(userMessage.text, MOCK_STUDENTS, historyForApi);

        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText || "I couldn't generate a response."
        };

        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 md:right-8 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            {isOpen && (
                <div className="pointer-events-auto mb-4 w-[350px] md:w-[400px] h-[500px] max-h-[80vh] flex flex-col animate-fade-in origin-bottom-right">
                    <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden shadow-2xl border-blue-500/30 bg-[#0f1021]/80 backdrop-blur-xl">
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-600/40 to-purple-600/40 border-b border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/10 rounded-full border border-white/20">
                                    <Bot size={20} className="text-blue-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">ce vault ai assist ofhatbit</h3>
                                    <p className="text-[10px] text-blue-200 flex items-center gap-1">
                                        <Sparkles size={8} /> Powered by Gemini 3.0 Pro
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div 
                                        className={`
                                            max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                                            ${msg.role === 'user' 
                                                ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-900/20' 
                                                : 'bg-white/10 text-gray-100 rounded-bl-none border border-white/10'
                                            }
                                        `}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                                        <Loader2 className="animate-spin text-blue-400" size={16} />
                                        <span className="text-xs text-gray-400">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-black/20 border-t border-white/10">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about marks, SGPA..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder-gray-500"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Toggle Button */}
            <div className="pointer-events-auto">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="ce vault ai assist ofhatbit chat assistant"
                    title="ce vault ai assist ofhatbit"
                    className={`
                        w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300
                        ${isOpen 
                            ? 'bg-red-500/80 rotate-90 text-white border border-red-400' 
                            : 'bg-gradient-to-tr from-blue-600 to-purple-600 text-white border border-white/20 hover:scale-110'
                        }
                    `}
                >
                    {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
                </button>
            </div>
        </div>
    );
};

export default ChatBot;