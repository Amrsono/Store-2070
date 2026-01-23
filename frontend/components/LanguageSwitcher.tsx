"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export const LanguageSwitcher = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const isArabic = pathname.startsWith('/ar');

    const toggleLanguage = () => {
        const segments = pathname.split('/');
        // pathname starts with /, so segments[0] is '' and segments[1] is the locale
        if (segments[1] === 'ar') {
            segments[1] = 'en';
        } else {
            segments[1] = 'ar';
        }
        const newPath = segments.join('/');

        startTransition(() => {
            router.push(newPath);
        });
    };

    return (
        <button
            onClick={toggleLanguage}
            disabled={isPending}
            className="px-3 py-1 glass border border-white/10 rounded-lg text-[10px] font-mono text-neon-blue hover:neon-border transition-all uppercase"
        >
            {isArabic ? 'English (EN)' : 'العربية (AR)'}
        </button>
    );
};
