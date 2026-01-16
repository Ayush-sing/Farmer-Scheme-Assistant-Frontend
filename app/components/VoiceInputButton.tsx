"use client";

import { Mic, MicOff } from "lucide-react";
import { Lang, TEXT } from "@/app/lib/i18n";
import { useEffect, useRef, useState } from "react";

declare global {
    interface Window {
        webkitSpeechRecognition?: any;
        SpeechRecognition?: any;
    }
}

export default function VoiceInputButton({
    lang,
    onText,
}: {
    lang: Lang;
    onText: (t: string) => void;
}) {
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return;

        const recog = new SR();
        recog.continuous = true;
        recog.interimResults = true;

        // English + Hindi support (depends on lang toggle)
        recog.lang = lang === "hi" ? "hi-IN" : "en-IN";

        recog.onresult = (event: any) => {
            let finalText = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const res = event.results[i];
                if (res.isFinal) finalText += res[0].transcript;
            }
            if (finalText.trim()) onText(finalText.trim() + " ");
        };

        recog.onend = () => {
            setListening(false);
        };

        recognitionRef.current = recog;
        
        const handleHide = () => {
            try { recog.stop(); } catch { }
        };
        document.addEventListener("visibilitychange", handleHide);

        return () => {
            document.removeEventListener("visibilitychange", handleHide);
        };

    }, [lang, onText]);

    const start = () => {
        if (!recognitionRef.current) {
            alert("Speech Recognition is not supported in this browser.");
            return;
        }
        setListening(true);
        recognitionRef.current.start();
    };

    const stop = () => {
        if (!recognitionRef.current) return;
        recognitionRef.current.stop();
        setListening(false);
    };

    return (
        <button
            onClick={listening ? stop : start}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 hover:border-white/35 transition bg-white/5"
            title={TEXT[lang].voiceType}
        >
            {listening ? (
                <>
                    <MicOff className="w-4 h-4" />
                    <span className="text-sm">{TEXT[lang].stop}</span>
                </>
            ) : (
                <>
                    <Mic className="w-4 h-4" />
                    <span className="text-sm">{TEXT[lang].voiceType}</span>
                </>
            )}
        </button>
    );
}
