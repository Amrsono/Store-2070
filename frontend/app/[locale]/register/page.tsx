"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight, User, Mail, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Encryption Keys (Passwords) do not match.');
            setLoading(false);
            return;
        }

        try {
            const query = `
                mutation {
                    register(username: "${username}", password: "${password}") {
                        success
                        message
                        token
                        userId
                    }
                }
            `;

            const response = await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });

            const result = await response.json();

            // Check for GraphQL errors
            if (result.errors) {
                setError(result.errors[0].message);
                setLoading(false);
                return;
            }

            const data = result.data.register;

            if (data.success) {
                // Store token
                localStorage.setItem('auth_token', data.token);
                // Redirect to homepage as a new user
                router.push('/');
            } else {
                setError(data.message || 'Registration Failed');
            }
        } catch (err) {
            console.error(err);
            setError('System Error: Identity fabrication failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-obsidian flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-neon-blue/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-neon-purple/5 blur-[120px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-blue"></div>

                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(188,19,254,0.2)]">
                            <User className="w-8 h-8 text-neon-purple" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-black text-center text-white uppercase tracking-widest mb-2">New Identity</h1>
                    <p className="text-center text-white/40 font-mono text-xs uppercase mb-8">Forge your digital presence on the grid.</p>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-obsidian-light border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-neon-purple/50 focus:shadow-[0_0_10px_rgba(188,19,254,0.1)] outline-none transition-all font-mono"
                                    placeholder="DESIRED_ALIAS"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Passcode</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-obsidian-light border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-neon-purple/50 focus:shadow-[0_0_10px_rgba(188,19,254,0.1)] outline-none transition-all font-mono"
                                    placeholder="MIN_STRENGTH_8"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Confirm Passcode</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-obsidian-light border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:border-neon-purple/50 focus:shadow-[0_0_10px_rgba(188,19,254,0.1)] outline-none transition-all font-mono"
                                    placeholder="CONFIRM_STRENGTH"
                                    required
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
                            className="w-full py-4 bg-neon-purple text-white font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-obsidian transition-all shadow-[0_0_20px_rgba(188,19,254,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="animate-pulse">Forging...</span>
                            ) : (
                                <>
                                    Create Identity <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-white/30">ALREADY REGISTERED?</span>
                        <Link href="/login" className="text-xs font-bold font-mono text-neon-blue hover:text-white transition-colors uppercase tracking-widest">
                            &lt; Return to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
