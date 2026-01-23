"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, Shield } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useParams } from 'next/navigation';

export const Navbar = () => {
    const params = useParams();
    const isArabic = params?.locale === 'ar';

    const t = {
        products: isArabic ? 'المنتجات' : 'Products',
        vault: isArabic ? 'الخزنة' : 'The Vault',
        systems: isArabic ? 'الأنظمة' : 'Systems',
        subtitle: isArabic ? 'آمان كمومي' : 'QUANTUM SECURE'
    };
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-lg bg-neon-blue/20 flex items-center justify-center border border-neon-blue/50 group-hover:neon-border transition-all">
                        <Shield className="w-6 h-6 text-neon-blue" />
                    </div>
                    <div>
                        <span className="text-xl font-bold tracking-tighter neon-text uppercase">Store 2070</span>
                        <div className="text-[10px] text-neon-blue/60 font-mono leading-none">{t.subtitle}</div>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest text-white/70 uppercase">
                    <Link href="/products" className="hover:text-neon-blue transition-colors">{t.products}</Link>
                    <Link href="/vault" className="hover:text-neon-blue transition-colors">{t.vault}</Link>
                    <Link href="/dashboard" className="hover:text-neon-blue transition-colors">{t.systems}</Link>
                </div>

                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
                        <ShoppingCart className="w-5 h-5 text-neon-blue" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-neon-purple rounded-full"></span>
                    </button>
                    <Link href="/login" className="p-2 hover:bg-white/5 rounded-full transition-colors flex items-center justify-center">
                        <User className="w-5 h-5 text-white/70" />
                    </Link>
                    <button className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors">
                        <Menu className="w-5 h-5 text-white/70" />
                    </button>
                </div>
            </div>
        </nav>
    );
};
