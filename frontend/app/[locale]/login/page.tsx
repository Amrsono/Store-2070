"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const query = `
                mutation {
                    login(username: "${username}", password: "${password}") {
                        success
                        message
                        isAdmin
                        token
                    }
                }
            `;

            const response = await fetch('/graphql/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 50)}`);
            }

            const responseText = await response.text();
            if (!responseText) {
                throw new Error("Empty response from server");
            }

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                throw new Error(`Invalid JSON: ${responseText.slice(0, 50)}`);
            }

            const data = result.data.login;

            if (data.success) {
                // Store token (in a real app, use HTTP-only cookies or secure storage)
                localStorage.setItem('auth_token', data.token);

                if (data.isAdmin === 1) {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else {
                setError(data.message || 'Access Denied');
            }
        } catch (err: any) {
            console.error('Login Error:', err);
            setError(`System Error: ${err.message || 'Connection to Core failed.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-obsidian flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-blue/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-purple/5 blur-[120px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-purple"></div>

                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.2)]">
                            <Shield className="w-8 h-8 text-neon-blue" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-black text-center text-white uppercase tracking-widest mb-2">Login</h1>


                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-obsidian-light border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-neon-blue/50 focus:shadow-[0_0_10px_rgba(0,242,255,0.1)] outline-none transition-all font-mono"
                                    placeholder="USER_ID"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-obsidian-light border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-neon-purple/50 focus:shadow-[0_0_10px_rgba(200,20,255,0.1)] outline-none transition-all font-mono"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono flex items-center justify-center gap-2">
                                <Shield className="w-3 h-3" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-neon-blue text-obsidian font-bold uppercase tracking-[0.2em] hover:bg-white transition-all neon-border flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="animate-pulse">Authenticating...</span>
                            ) : (
                                <>
                                    Log In <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col items-center gap-4 text-center">
                        <a href="/register" className="text-xs font-mono text-neon-blue hover:text-white transition-colors uppercase tracking-wider">
                            Don't have an account? Register
                        </a>
                        <a href="#" className="text-[10px] font-mono text-white/30 hover:text-neon-blue transition-colors uppercase">Forgot Credentials?</a>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
