export type Lang = "en" | "hi";

export const TEXT = {
    en: {
        appName: "Farmer Scheme Assistant",
        subtitle: "Government scheme guidance with official sources",
        chooseLang: "Choose Language",
        english: "English",
        hindi: "Hindi",
        placeholder:
            "Describe your problem in detail...\nExample: I am a small farmer in UP. I want to buy a tractor and need subsidy or loan support.",
        send: "Send",
        speaking: "Speaking...",
        voiceType: "Voice typing",
        readAloud: "Read aloud",
        stop: "Stop",
        sources: "Official Sources",
        matchedSchemes: "Matched Schemes",
        thinking: "Thinking...",
        footerDisclaimer: "Farmer Scheme Assistant can make mistakes. Check important info.",
        error:
            "Something went wrong. Please try again or check backend is running.",
    },
    hi: {
        appName: "किसान योजना सहायक",
        subtitle: "सरकारी योजनाओं की जानकारी और आधिकारिक लिंक",
        chooseLang: "भाषा चुनें",
        english: "English",
        hindi: "हिन्दी",
        placeholder:
            "अपनी समस्या विस्तार से लिखें...\nउदाहरण: मैं यूपी का छोटा किसान हूँ। मुझे ट्रैक्टर खरीदना है और सब्सिडी/लोन की जानकारी चाहिए।",
        send: "भेजें",
        speaking: "बोल रहे हैं...",
        voiceType: "आवाज़ से लिखें",
        readAloud: "पढ़कर सुनाएँ",
        stop: "रोकें",
        sources: "आधिकारिक स्रोत",
        matchedSchemes: "मिले हुए योजनाएँ",
        thinking: "सोच रहा हूँ...",
        footerDisclaimer: "किसान योजना सहायक से गलती हो सकती है। महत्वपूर्ण जानकारी जरूर जांचें।",
        error:
            "कुछ गलत हो गया। कृपया फिर कोशिश करें या backend चल रहा है या नहीं जाँचें।",
    },
} as const;
