import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, Loader2, Download } from 'lucide-react';
import { useChat } from 'ai/react';
import { GlassCard } from './GlassComponents';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [detectedRollNumber, setDetectedRollNumber] = useState<string | null>(null);

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        initialMessages: [
            { 
                id: '1', 
                role: 'assistant', 
                content: '👋 Hi! I\'m CE VAULT AI ASSIST. I can help you with:\n• Finding any student by name or roll number\n• Checking marks, SGPA, and grades\n• Getting improvement guidance\n\nTry asking: "Show marks of roll 211991524001" or "What is SGPA of <name>?"' 
            }
        ],
        onError: (error) => {
            console.error('Chat error:', error);
        }
    });

    // Extract roll number from messages to show PDF download button
    useEffect(() => {
        const lastAssistantMessage = messages
            .filter((m) => m.role === 'assistant')
            .pop()?.content || '';

        // Look for roll number pattern in assistant message
        const rollMatch = lastAssistantMessage.match(/Roll Number:\s*(\d{10,12})/i);
        if (rollMatch) {
            setDetectedRollNumber(rollMatch[1]);
        } else {
            // Also check user messages for roll numbers
            const lastUserMessage = messages
                .filter((m) => m.role === 'user')
                .pop()?.content || '';
            const userRollMatch = lastUserMessage.match(/\b(\d{10,12})\b/);
            if (userRollMatch && lastAssistantMessage.includes('STUDENT DATA FOUND')) {
                setDetectedRollNumber(userRollMatch[1]);
            } else {
                setDetectedRollNumber(null);
            }
        }
    }, [messages]);

    const handleDownloadPDF = () => {
        if (detectedRollNumber) {
            window.open(`/api/students/pdf?rollNumber=${detectedRollNumber}`, '_blank');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            handleSubmit(e);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
                // Create a synthetic form event for handleSubmit
                const form = e.currentTarget.form;
                if (form) {
                    const formEvent = new Event('submit', { bubbles: true, cancelable: true });
                    Object.defineProperty(formEvent, 'target', { value: form, enumerable: true });
                    handleSubmit(formEvent as unknown as React.FormEvent<HTMLFormElement>);
                }
            }
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
                                    <h3 className="font-bold text-white text-sm">CE VAULT AI ASSIST</h3>
                                    <p className="text-[10px] text-blue-200 flex items-center gap-1">
                                        <Sparkles size={8} /> Powered by Gemini Robotics
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
                                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
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
                                        {msg.content}
                                    </div>
                                    {/* PDF Download Button - show after assistant message with student data */}
                                    {msg.role === 'assistant' && 
                                     detectedRollNumber && 
                                     msg.id === messages.filter(m => m.role === 'assistant').pop()?.id && (
                                        <button
                                            onClick={handleDownloadPDF}
                                            className="mt-2 px-3 py-1.5 bg-green-600/80 hover:bg-green-500 text-white text-xs rounded-full flex items-center gap-2 transition-all shadow-lg"
                                        >
                                            <Download size={14} />
                                            Download Result PDF
                                        </button>
                                    )}
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
                            <form onSubmit={handleFormSubmit} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask about marks, SGPA..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder-gray-500"
                                />
                                <button 
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Toggle Button */}
            <div className="pointer-events-auto">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="CE VAULT AI ASSIST chat assistant"
                    title="CE VAULT AI ASSIST"
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