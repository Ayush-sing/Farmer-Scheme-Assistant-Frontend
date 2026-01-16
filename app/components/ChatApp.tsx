"use client";
import ReactMarkdown from "react-markdown";
import { useEffect, useMemo, useRef, useState } from "react";
import { Lang, TEXT } from "@/app/lib/i18n";
import LanguageToggle from "./LanguageToggle";
import MessageInput from "./MessageInput";
import SchemeCards from "./SchemeCards";
import { Volume2, Square } from "lucide-react";

type ChatResponse = {
    status: string;
    final_answer?: string;
    schemes_found?: any[];
    message?: string;
};

export default function ChatApp() {
    const [lang, setLang] = useState<Lang>("en");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [finalAnswer, setFinalAnswer] = useState("");
    const [schemes, setSchemes] = useState<any[]>([]);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [history, setHistory] = useState<
        { role: "user" | "bot"; text: string; ts: number }[]
    >([]);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);

    const backendUrl = useMemo(() => {
        return process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
    }, []);

    const SUGGESTIONS = {
        en: [
            "I want to buy a tractor. Is there any government scheme for subsidy or loan?",
            "My crop got damaged due to heavy rainfall. Which insurance scheme can help?",
            "I grow vegetables and need cold storage / warehouse support. Any scheme?",
            "We want to form an FPO. Any government scheme for FPO support?"
        ],
        hi: [
            "मुझे ट्रैक्टर खरीदना है। क्या सरकार की कोई सब्सिडी/लोन योजना है?",
            "बारिश से फसल खराब हो गई। कौन सी बीमा योजना मदद करेगी?",
            "मैं सब्जियाँ उगाता हूँ और कोल्ड स्टोरेज/गोदाम सहायता चाहिए। कोई योजना?",
            "हम FPO बनाना चाहते हैं। क्या सरकार की कोई योजना है?"
        ]
    };


    // TTS state
    const [speaking, setSpeaking] = useState(false);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    useEffect(() => {
        const onEnd = () => setSpeaking(false);
        const onHide = () => window.speechSynthesis?.cancel();
        document.addEventListener("visibilitychange", onHide);
        window.speechSynthesis?.addEventListener("end", onEnd);
        return () => {
            try {
                document.removeEventListener("visibilitychange", onHide);
                window.speechSynthesis?.cancel();
                window.speechSynthesis?.removeEventListener("end", onEnd);
            } catch { }
        };
    }, []);

    const speak = () => {
        if (!finalAnswer?.trim()) return;
        if (!("speechSynthesis" in window)) {
            alert("Text-to-Speech not supported in this browser.");
            return;
        }

        window.speechSynthesis.cancel();
        const cleanForTTS = finalAnswer
            .replace(/\*\*/g, "")
            .replace(/#+\s?/g, "")
            .replace(/https?:\/\/\S+/g, "")
            .replace(/\bwww\.\S+/g, "")        
            .replace(/\n{3,}/g, "\n\n");

        const u = new SpeechSynthesisUtterance(cleanForTTS);

        u.lang = lang === "hi" ? "hi-IN" : "en-IN";

        const voices = window.speechSynthesis.getVoices();

        // try to pick real Hindi voice
        const hindiVoice =
            voices.find((v) => v.lang === "hi-IN") ||
            voices.find((v) => (v.lang || "").toLowerCase().startsWith("hi"));

        if (lang === "hi" && !hindiVoice) {
            alert("Hindi voice not available on this device. Reading with default voice.");
        } else if (lang === "hi" && hindiVoice) {
            u.voice = hindiVoice;
        }

        u.onend = () => setSpeaking(false);
        u.onerror = () => setSpeaking(false);

        setSpeaking(true);
        window.speechSynthesis.speak(u);


    };

    const stopSpeak = () => {
        window.speechSynthesis.cancel();
        setSpeaking(false);
    };

    const copyAnswer = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch {
            alert("Copy failed");
        }
    };


    const send = async () => {
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${backendUrl}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            const data: ChatResponse = await res.json();

            setHistory((prev) => [...prev, { role: "user", text: message, ts: Date.now() }]);

            if (data.status !== "success") {
                const botText = data.message || TEXT[lang].error;
                setFinalAnswer(botText);
                setSchemes([]);
                setHistory((prev) => [...prev, { role: "bot", text: botText, ts: Date.now() }]);
            } else {
                const botText = data.final_answer || "";
                setFinalAnswer(botText);
                setSchemes(data.schemes_found || []);
                setHistory((prev) => [...prev, { role: "bot", text: botText, ts: Date.now() }]);
            }

        } catch (e) {
            setError(TEXT[lang].error);
        } finally {
            setLoading(false);
            setMessage("");
        }
    };

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-black via-zinc-950 to-zinc-900 text-white">
            <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            {TEXT[lang].appName}
                        </h1>
                        <p className="text-sm md:text-base opacity-80 mt-1">
                            {TEXT[lang].subtitle}
                        </p>
                    </div>

                    <div className="shrink-0">
                        <LanguageToggle lang={lang} setLang={setLang} />
                    </div>
                </div>

                {/* Input */}
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6">
                    <MessageInput
                        lang={lang}
                        value={message}
                        setValue={setMessage}
                        onSend={send}
                        loading={loading}
                    />
                </div>

                {/* Quick Suggestions */}
                {showSuggestions && history.length === 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {SUGGESTIONS[lang].map((s, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setMessage(s);
                                setShowSuggestions(false);
                            }}
                            className="px-3 py-2 rounded-full text-xs md:text-sm border border-white/10 bg-white/5 hover:border-white/30 transition"
                        >
                            {s}
                        </button>
                    ))}
                </div>
                )}

                
                {/* Answer */}
                {history.length > 0 && (
                    <div className="mt-6 space-y-3">
                        {history.map((m, i) => (
                            <div
                                key={i}
                                className={`max-w-[92%] md:max-w-[75%] rounded-2xl px-4 py-3 border ${m.role === "user"
                                        ? "ml-auto bg-white text-black border-white/30"
                                        : "mr-auto bg-white/5 border-white/10"
                                    }`}
                            >
                                <div className="prose prose-invert max-w-none text-sm md:text-base opacity-90">
                                    <ReactMarkdown>{m.text}</ReactMarkdown>
                                </div>

                                <div className="mt-2 text-[11px] opacity-60">
                                    {new Date(m.ts ?? Date.now()).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>



                                {/* Read aloud button only for the latest bot reply */}
                                {m.role === "bot" && i === history.length - 1 && m.text?.trim() && (
                                    <div className="mt-3 flex gap-2 flex-wrap">
                                        <button
                                            onClick={speaking ? stopSpeak : speak}
                                            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 hover:border-white/35 transition bg-white/5"
                                        >
                                            {speaking ? (
                                                <>
                                                    <Square className="w-4 h-4" />
                                                    <span className="text-sm">{TEXT[lang].stop}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Volume2 className="w-4 h-4" />
                                                    <span className="text-sm">{TEXT[lang].readAloud}</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => copyAnswer(m.text)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 hover:border-white/35 transition bg-white/5"
                                        >
                                            <span className="text-sm">
                                                {copied ? (lang === "hi" ? "कॉपी हो गया" : "Copied") : (lang === "hi" ? "कॉपी करें" : "Copy")}
                                            </span>
                                        </button>

                                    </div>
                                )}
                            </div>

                        ))}
                        <div ref={bottomRef} />
                    </div>
                )}
                

                {/* Schemes */}
                <SchemeCards lang={lang} schemes={schemes} />

                {/* Footer */}
                <div className="mt-10 text-xs opacity-50">
                    {TEXT[lang].footerDisclaimer}
                </div>

            </div>
        </div>
    );
}
