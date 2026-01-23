"use client";

import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, BarChart, Bar
} from 'recharts';
import { Activity, ShieldCheck, Zap, Globe } from 'lucide-react';

const data = [
    { name: '00:00', value: 400, uv: 2400 },
    { name: '04:00', value: 300, uv: 1398 },
    { name: '08:00', value: 600, uv: 9800 },
    { name: '12:00', value: 800, uv: 3908 },
    { name: '16:00', value: 500, uv: 4800 },
    { name: '20:00', value: 900, uv: 3800 },
    { name: '23:59', value: 1100, uv: 4300 },
];

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <div className="glass p-6 rounded-xl border border-white/10 hover:border-neon-blue/50 transition-all group">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-neon-blue/10 rounded-lg group-hover:bg-neon-blue/20 transition-colors">
                <Icon className="w-5 h-5 text-neon-blue" />
            </div>
            <span className={`text-xs font-mono ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {trend}
            </span>
        </div>
        <div className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">{value}</div>
        <div className="text-xs text-white/40 uppercase tracking-widest font-mono">{title}</div>
    </div>
);

export const Dashboard = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-white uppercase tracking-tighter mb-2">Network Diagnostics</h2>
                <p className="text-white/50 font-mono text-sm uppercase tracking-widest">Real-time market volatility and transaction throughput</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard title="Active Nodes" value="4,209" icon={Globe} trend="+12.5%" />
                <StatCard title="Current Hashrate" value="842 TH/s" icon={Zap} trend="+3.2%" />
                <StatCard title="Security Level" value="99.9%" icon={ShieldCheck} trend="+0.01%" />
                <StatCard title="Market Vol" value="124.5B" icon={Activity} trend="-4.1%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass p-8 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Transaction Flow</h3>
                        <div className="flex gap-4">
                            <span className="text-[10px] text-white/40 font-mono">LIVE FEED</span>
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00f2ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid #ffffff20', color: '#fff' }}
                                    itemStyle={{ color: '#00f2ff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#00f2ff" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass p-8 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-8">Asset Liquidity</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0d0d0d', border: '1px solid #ffffff20', color: '#fff' }}
                                />
                                <Bar dataKey="uv" fill="#bc13fe" radius={[4, 4, 0, 0]} opacity={0.6} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
