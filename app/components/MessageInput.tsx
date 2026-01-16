"use client";

import { Send } from "lucide-react";
import { Lang, TEXT } from "@/app/lib/i18n";
import VoiceInputButton from "./VoiceInputButton";

export default function MessageInput({
    lang,
    value,
    setValue,
    onSend,
    loading,
}: {
    lang: Lang;
    value: string;
    setValue: (v: string) => void;
    onSend: () => void;
    loading: boolean;
}) {
    return (
        <div className="w-full flex flex-col gap-2">
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSend();
                    }
                }}
                placeholder={TEXT[lang].placeholder}
                className="w-full min-h-30 md:min-h-35 rounded-2xl bg-white/5 border border-white/10 focus:border-white/30 outline-none p-4 text-sm md:text-base resize-none"
            />

            <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
                <VoiceInputButton
                    lang={lang}
                    onText={(t) => setValue(value + t)}
                />

                <button
                    onClick={onSend}
                    disabled={loading || !value.trim()}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white text-black font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
                >
                    <Send className="w-4 h-4" />
                    {loading ? TEXT[lang].thinking : TEXT[lang].send}
                </button>
            </div>
        </div>
    );
}
