"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send, ShieldAlert, User, Sparkles, Mic,
    Plus, MessageSquareHeart, Zap, Brain,
    HeartHandshake, Baby, ChevronRight, Star
} from "lucide-react";

const quickSuggestions = [
    { icon: ShieldAlert, text: "Urgence ?", color: "text-rose-500", bg: "bg-rose-50 border-rose-100", hoverBg: "hover:bg-rose-500", label: "Urgence médicale" },
    { icon: MessageSquareHeart, text: "Post-Vaccin", color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-100", hoverBg: "hover:bg-emerald-500", label: "Conseils Post-Vaccin" },
    { icon: Baby, text: "Mon Bébé", color: "text-sky-500", bg: "bg-sky-50 border-sky-100", hoverBg: "hover:bg-sky-500", label: "Suivi bébé" },
    { icon: Brain, text: "Calendrier", color: "text-violet-500", bg: "bg-violet-50 border-violet-100", hoverBg: "hover:bg-violet-500", label: "Programme vaccinal" },
];

const features = [
    { icon: Zap, label: "Réponse instantanée", color: "from-amber-400 to-orange-400" },
    { icon: Brain, label: "IA médicale avancée", color: "from-violet-400 to-purple-400" },
    { icon: HeartHandshake, label: "Accompagnement 24/7", color: "from-teal-400 to-emerald-400" },
];

export default function SupportPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Bonjour ! Je suis VacciCare AI, votre assistant santé intelligent.\n\nComment puis-je vous accompagner aujourd'hui ? 😊",
            sender: 'bot',
            time: '10:00'
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = (text?: string) => {
        const msg = text || inputValue;
        if (!msg.trim()) return;

        const newUserMsg = {
            id: Date.now(),
            text: msg,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const botMsg = {
                id: Date.now() + 1,
                text: "J'analyse votre demande... D'après les protocoles pédiatriques de 2026, je vous recommande de consulter un professionnel de santé si les symptômes persistent. Je peux aussi vous aider à trouver le centre de vaccination le plus proche.",
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col gap-6 relative">
            {/* Header */}
            <div className="relative rounded-[2rem] overflow-hidden p-6 md:p-8 gradient-hero border border-white/80 shadow-xl shrink-0">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-52 h-52 bg-violet-200/30 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-sky-200/30 rounded-full -ml-12 -mb-12 blur-2xl pointer-events-none" />

                {/* Floating icons */}
                <div className="absolute top-4 right-6 w-14 h-14 bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg animate-float hidden md:flex">
                    <Brain className="text-violet-500" size={24} />
                </div>
                <div className="absolute bottom-4 right-24 w-10 h-10 bg-teal-100/90 rounded-xl flex items-center justify-center animate-float-reverse hidden md:flex" style={{ animationDelay: '1s' }}>
                    <HeartHandshake className="text-teal-500" size={18} />
                </div>

                <div className="relative z-10 flex items-start gap-5">
                    {/* AI Avatar */}
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-violet-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-sky-200 shrink-0">
                        <Sparkles className="text-white" size={28} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-black text-slate-900">
                                Assistant <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-violet-500">VacciCare</span>
                            </h1>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-white shadow-sm">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">En ligne</span>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm font-medium mb-4">
                            L'intelligence artificielle au service de votre sérénité parentale.
                        </p>
                        {/* Feature pills */}
                        <div className="flex gap-2 flex-wrap">
                            {features.map(f => (
                                <div key={f.label} className="flex items-center gap-2 px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-xl border border-white/80 shadow-sm">
                                    <div className={`w-5 h-5 bg-gradient-to-br ${f.color} rounded-md flex items-center justify-center text-white`}>
                                        <f.icon size={11} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{f.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 glass-card overflow-hidden flex flex-col shadow-2xl shadow-sky-900/5 border-white/70 min-h-0">
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 16, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                            className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${msg.sender === 'bot'
                                    ? 'bg-gradient-to-br from-sky-400 to-violet-500 text-white'
                                    : 'bg-white text-slate-600 border-2 border-slate-100'
                                }`}>
                                {msg.sender === 'bot' ? <Sparkles size={18} /> : <User size={18} />}
                            </div>

                            {/* Bubble */}
                            <div className={`max-w-[76%] space-y-1.5 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                                <div className={`px-5 py-4 rounded-3xl text-sm leading-relaxed inline-block text-left ${msg.sender === 'bot'
                                        ? 'bg-white/80 text-slate-800 rounded-tl-none border border-white shadow-sm'
                                        : 'bg-gradient-to-br from-sky-400 to-violet-500 text-white rounded-tr-none shadow-xl shadow-sky-900/15'
                                    }`}>
                                    <p className="whitespace-pre-line">{msg.text}</p>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1">{msg.time}</p>
                            </div>
                        </motion.div>
                    ))}

                    {/* Typing indicator */}
                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex gap-4"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 text-white flex items-center justify-center">
                                    <Sparkles size={18} className="animate-spin" style={{ animationDuration: '3s' }} />
                                </div>
                                <div className="bg-white/80 px-5 py-4 rounded-3xl rounded-tl-none border border-white shadow-sm">
                                    <div className="flex gap-1.5 items-center h-4">
                                        {[0, 0.2, 0.4].map((delay, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.8, delay }}
                                                className="w-2 h-2 bg-gradient-to-b from-sky-400 to-violet-400 rounded-full"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className="shrink-0 p-5 md:p-6 bg-white/50 backdrop-blur-md border-t border-white/60">
                    {/* Quick suggestions */}
                    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                        {quickSuggestions.map(s => (
                            <button
                                key={s.text}
                                onClick={() => handleSend(s.label)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all shrink-0 ${s.bg} ${s.color} hover:text-white ${s.hoverBg} hover:border-transparent hover:shadow-md`}
                            >
                                <s.icon size={13} />
                                {s.text}
                            </button>
                        ))}
                    </div>

                    {/* Input row */}
                    <div className="flex items-center gap-3">
                        <button className="p-3.5 bg-white hover:bg-slate-50 text-slate-400 hover:text-sky-500 rounded-2xl transition-all shadow-sm border border-slate-100 shrink-0">
                            <Plus size={22} />
                        </button>

                        <div className="flex-1 bg-white rounded-[2rem] flex items-center px-5 border-2 border-slate-100 shadow-inner group focus-within:ring-4 focus-within:ring-sky-500/10 focus-within:border-sky-300 transition-all">
                            <input
                                type="text"
                                placeholder="Posez votre question sur la santé..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="w-full py-4 bg-transparent border-none focus:ring-0 text-slate-700 font-medium placeholder:text-slate-400 outline-none text-sm"
                            />
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-400 hover:text-sky-500 transition-colors">
                                    <Mic size={20} />
                                </button>
                                <motion.button
                                    whileTap={{ scale: 0.93 }}
                                    onClick={() => handleSend()}
                                    className={`p-3 rounded-xl transition-all ${inputValue.trim()
                                            ? 'bg-gradient-to-br from-sky-400 to-violet-500 text-white shadow-lg shadow-sky-200'
                                            : 'text-slate-300 bg-slate-50'
                                        }`}
                                >
                                    <Send size={18} />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
