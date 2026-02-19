"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    ShieldAlert,
    Bot,
    User,
    Sparkles,
    Mic,
    Plus,
    ArrowDownCircle,
    MessageSquareHeart
} from "lucide-react";

export default function SupportPage() {
    const [messages, setMessages] = useState([
        { id: 1, text: "Bonjour ! Je suis VacciCare AI, votre assistant santé intelligent. Comment puis-je vous accompagner aujourd'hui ?", sender: 'bot', time: '10:00' },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newUserMsg = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");
        setIsTyping(true);

        // Mock bot response with a premium feel
        setTimeout(() => {
            setIsTyping(false);
            const botMsg = {
                id: Date.now() + 1,
                text: "J'analyse les symptômes de Lucas... D'après les protocoles pédiatriques de 2026, s'il y a une fièvre légère post-vaccination, hydratez-le bien. Si la température dépasse 38.5°C, je recommande une consultation vidéo immédiate.",
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col relative">
            {/* AI Centered Header */}
            <div className="text-center mb-10 space-y-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full shadow-sm"
                >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">IA Active - Prête à aider</span>
                </motion.div>

                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                        Assistant <span className="text-sky-500">VacciCare</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">L'intelligence artificielle au service de votre sérénité.</p>
                </div>
            </div>

            {/* Main Conversational Interface */}
            <div className="flex-1 glass-card overflow-hidden flex flex-col shadow-2xl shadow-sky-900/5 border-white/60">
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar"
                >
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.sender === 'bot'
                                    ? 'bg-gradient-to-br from-sky-400 to-indigo-500 text-white'
                                    : 'bg-white text-slate-600 border border-slate-100'
                                }`}>
                                {msg.sender === 'bot' ? <Sparkles size={20} /> : <User size={20} />}
                            </div>
                            <div className={`max-w-[75%] space-y-2 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                                <div className={`p-5 rounded-3xl text-sm md:text-base leading-relaxed inline-block ${msg.sender === 'bot'
                                        ? 'bg-slate-50/80 text-slate-800 rounded-tl-none border border-white'
                                        : 'gradient-primary text-white rounded-tr-none shadow-xl shadow-sky-900/10'
                                    }`}>
                                    <p>{msg.text}</p>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{msg.time}</p>
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-4"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 text-white flex items-center justify-center shrink-0">
                                <Sparkles size={20} className="animate-spin" style={{ animationDuration: '3s' }} />
                            </div>
                            <div className="bg-slate-50/50 px-6 py-4 rounded-3xl rounded-tl-none border border-white">
                                <div className="flex gap-1.5">
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input Controls */}
                <div className="p-6 md:p-8 bg-white/40 backdrop-blur-md border-t border-white/50">
                    <div className="relative flex items-center gap-4">
                        <button className="p-4 bg-white/80 hover:bg-white text-slate-400 hover:text-sky-500 rounded-2xl transition-all shadow-sm border border-slate-100 flex-shrink-0">
                            <Plus size={24} />
                        </button>

                        <div className="flex-1 bg-white/80 rounded-[2rem] flex items-center px-6 border border-slate-100 shadow-inner group focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                            <input
                                type="text"
                                placeholder="Posez n'importe quelle question sur la santé..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="w-full py-5 bg-transparent border-none focus:ring-0 text-slate-700 font-medium placeholder:text-slate-400"
                            />
                            <div className="flex items-center gap-3">
                                <button className="p-2 text-slate-400 hover:text-sky-500 transition-colors">
                                    <Mic size={22} />
                                </button>
                                <button
                                    onClick={handleSend}
                                    className={`p-3 rounded-xl transition-all ${inputValue.trim()
                                            ? 'bg-sky-500 text-white shadow-lg shadow-sky-200'
                                            : 'text-slate-300'
                                        }`}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <button className="px-5 py-2 glass rounded-2xl text-[11px] font-bold text-slate-500 hover:text-sky-600 transition-colors flex items-center gap-2">
                            <ShieldAlert size={14} className="text-rose-500" />
                            Urgence ?
                        </button>
                        <button className="px-5 py-2 glass rounded-2xl text-[11px] font-bold text-slate-500 hover:text-sky-600 transition-colors flex items-center gap-2">
                            <MessageSquareHeart size={14} className="text-emerald-500" />
                            Conseils Post-Vaccin
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Scroll Down button if needed - hidden for now */}
            <button className="hidden absolute bottom-32 left-1/2 -translate-x-1/2 p-2 bg-white text-sky-500 rounded-full shadow-lg border border-slate-100 animate-bounce">
                <ArrowDownCircle size={20} />
            </button>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
}
