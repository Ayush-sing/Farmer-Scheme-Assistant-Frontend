"use client";

import { Lang, TEXT } from "@/app/lib/i18n";

export default function LanguageToggle({
    lang,
    setLang,
}: {
    lang: Lang;
    setLang: (l: Lang) => void;
}) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs opacity-70">{TEXT[lang].chooseLang}</span>

            <button
                onClick={() => setLang("en")}
                className={`px-3 py-1 rounded-full text-sm border transition ${lang === "en"
                        ? "bg-white text-black"
                        : "bg-transparent border-white/20 hover:border-white/40"
                    }`}
            >
                {TEXT[lang].english}
            </button>

            <button
                onClick={() => setLang("hi")}
                className={`px-3 py-1 rounded-full text-sm border transition ${lang === "hi"
                        ? "bg-white text-black"
                        : "bg-transparent border-white/20 hover:border-white/40"
                    }`}
            >
                {TEXT[lang].hindi}
            </button>
        </div>
    );
}
