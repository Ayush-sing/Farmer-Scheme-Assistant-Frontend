"use client";

import { ExternalLink } from "lucide-react";
import { Lang, TEXT } from "@/app/lib/i18n";

type Scheme = {
    scheme_name: string;
    summary?: string;
    eligibility?: string;
    benefits?: string;
    official_link?: string;
    source?: string;
};

export default function SchemeCards({
    lang,
    schemes,
}: {
    lang: Lang;
    schemes: Scheme[];
}) {
    if (!schemes?.length) return null;

    return (
        <div className="w-full mt-6">
            <h3 className="text-lg font-semibold mb-3">{TEXT[lang].matchedSchemes}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {schemes.map((s, idx) => (
                    <div
                        key={idx}
                        className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col">
                                {idx === 0 && (
                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10 w-fit mb-1">
                                        Top match
                                    </span>
                                )}
                                <h4 className="font-semibold text-base">{s.scheme_name}</h4>
                            </div>

                            {s.official_link && (
                                <a
                                    href={s.official_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs inline-flex items-center gap-1 opacity-80 hover:opacity-100"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>

                        {s.summary && <p className="text-sm opacity-85 mt-2">{s.summary}</p>}
                        {s.benefits && (
                            <p className="text-sm mt-2">
                                <span className="opacity-70">Benefit: </span>
                                {s.benefits}
                            </p>
                        )}
                        {s.eligibility && (
                            <p className="text-sm mt-2">
                                <span className="opacity-70">Eligibility: </span>
                                {s.eligibility}
                            </p>
                        )}

                        {s.official_link && (
                            <div className="mt-3">
                                <a
                                    href={s.official_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm underline underline-offset-4 opacity-90 hover:opacity-100"
                                >
                                    {TEXT[lang].sources}: {s.source || "Official"}
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
