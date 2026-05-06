import React, { useState } from "react";
import axios from "axios";
import { Bot, Send, X, Sparkles, User } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const AiChatbox = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Assalamu Walaikum! I’m your Ramadan Serenity assistant. Ask me about fasting, prayer, diet, duas, or Islamic lifestyle guidance.",
        },
    ]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const currentInput = input;
        const userMessage = { role: "user", content: currentInput };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/api/ai-assistant/ask`, {
                message: currentInput,
            });

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: res.data.reply,
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, I could not respond right now. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-6 right-6 z-50 group"
                >
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-emerald-400 blur-2xl opacity-40 group-hover:opacity-70 transition" />

                        <div className="relative h-20 w-20 rounded-full border border-emerald-400/30 bg-emerald-950/90 text-white shadow-2xl shadow-emerald-500/20 backdrop-blur-xl flex flex-col items-center justify-center hover:bg-emerald-900 transition">
                            <Sparkles size={25} className="text-emerald-300 mb-1" />
                            <span className="text-xs font-bold">Ask AI</span>
                        </div>
                    </div>
                </button>
            )}

            {open && (
                <div className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-[360px] h-[500px] bg-slate-950/95 border border-emerald-400/20 rounded-3xl shadow-2xl shadow-emerald-500/10 backdrop-blur-xl overflow-hidden flex flex-col text-white">
                    <div className="px-4 py-3 border-b border-white/10 bg-gradient-to-r from-emerald-950/80 via-slate-950 to-slate-950">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center text-emerald-300">
                                    <Bot size={21} />
                                </div>

                                <div>
                                    <h2 className="font-bold text-base">Ramadan AI</h2>
                                    <p className="text-xs text-gray-400">
                                        Islamic lifestyle assistant
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setOpen(false)}
                                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => {
                            const isUser = msg.role === "user";

                            return (
                                <div
                                    key={index}
                                    className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {!isUser && (
                                        <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0 mt-1">
                                            <Bot size={15} />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser
                                            ? "bg-emerald-600 text-white rounded-tr-sm"
                                            : "bg-white/10 border border-white/10 text-gray-100 rounded-tl-sm"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>

                                    {isUser && (
                                        <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-1">
                                            <User size={15} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {loading && (
                            <div className="flex gap-2 justify-start">
                                <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                                    <Bot size={15} />
                                </div>
                                <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-300">
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-white/10 p-3 bg-slate-950/80">
                        <div className="flex gap-2">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about Ramadan..."
                                rows="2"
                                className="flex-1 resize-none bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-emerald-400"
                            />

                            <button
                                onClick={sendMessage}
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 rounded-2xl transition"
                            >
                                <Send size={19} />
                            </button>
                        </div>

                        <p className="text-[10px] text-gray-500 mt-2">
                            General guidance only. For final rulings, consult a qualified scholar.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default AiChatbox;