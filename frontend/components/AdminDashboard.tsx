"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, BarChart, Settings, LogOut, Plus, Image as ImageIcon, Trash, CheckCircle } from 'lucide-react';

interface DashboardStats {
    dailyRevenue: number;
    weeklyVolume: number;
    monthlyThroughput: number;
    dailyChange: number;
    weeklyChange: number;
    monthlyChange: number;
}

interface Order {
    id: string;
    userId: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    items: any[];
}

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
}

interface DashboardData {
    dashboardStats: DashboardStats;
    orders: Order[];
    products: Product[];
}

export const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const query = `
                    query {
                        dashboardStats {
                            dailyRevenue
                            weeklyVolume
                            monthlyThroughput
                            dailyChange
                            weeklyChange
                            monthlyChange
                        }
                        orders {
                            id
                            userId
                            totalPrice
                            status
                            createdAt
                        }
                        products {
                            id
                            name
                            price
                            stock
                        }
                    }
                `;
                const response = await fetch('/api/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });
                const json = await response.json();
                if (json.data) {
                    setData(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen bg-obsidian flex items-center justify-center text-neon-blue font-mono">INITIALIZING ADMIN UPLINK...</div>;


    return (
        <div className="min-h-screen bg-obsidian flex text-white pt-20">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-white/10 hidden md:block">
                <div className="p-6">
                    <h2 className="text-xs font-mono text-neon-blue uppercase tracking-widest mb-8">Admin Control</h2>
                    <nav className="space-y-4">
                        <TabButton
                            active={activeTab === 'analytics'}
                            onClick={() => setActiveTab('analytics')}
                            icon={BarChart}
                            label="Analytics"
                        />
                        <TabButton
                            active={activeTab === 'products'}
                            onClick={() => setActiveTab('products')}
                            icon={Package}
                            label="Products"
                        />
                        <TabButton
                            active={activeTab === 'orders'}
                            onClick={() => setActiveTab('orders')}
                            icon={LayoutDashboard}
                            label="Orders"
                        />
                        <div className="pt-8 mt-8 border-t border-white/10">
                            <TabButton icon={Settings} label="Protocols" />
                            <TabButton icon={LogOut} label="Disconnect" className="text-red-400" />
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {activeTab === 'analytics' && data?.dashboardStats && <AnalyticsView stats={data.dashboardStats} />}
                {activeTab === 'products' && data?.products && <ProductsView products={data.products} />}
                {activeTab === 'orders' && data?.orders && <OrdersView orders={data.orders} />}
            </main>
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label, className }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30' : 'text-white/40 hover:text-white hover:bg-white/5'} ${className}`}
    >
        <Icon className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </button>
);

const AnalyticsView = ({ stats }: { stats: DashboardStats }) => (
    <div className="space-y-8">
        <div className="flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter">Market Intelligence</h1>
                <p className="text-white/40 font-mono text-xs uppercase">Quantum-synced order analytics</p>
            </div>
            <div className="flex gap-2">
                {['Daily', 'Weekly', 'Monthly'].map(period => (
                    <button key={period} className="px-4 py-2 glass border border-white/10 text-[10px] font-mono hover:neon-border transition-all uppercase">
                        {period}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatBox label="Daily Revenue" value={`Ξ ${stats.dailyRevenue}`} change={`+${stats.dailyChange}%`} />
            <StatBox label="Weekly Volume" value={`Ξ ${stats.weeklyVolume}`} change={`+${stats.weeklyChange}%`} />
            <StatBox label="Monthly Throughput" value={`Ξ ${stats.monthlyThroughput.toFixed(1)}`} change={`+${stats.monthlyChange}%`} />
        </div>

        <div className="glass p-8 rounded-2xl border border-white/10 h-96 flex items-center justify-center">
            <p className="text-white/20 font-mono text-sm">NEURAL CHART INTERFACE INITIALIZING...</p>
        </div>
    </div>
);

const StatBox = ({ label, value, change }: any) => (
    <div className="glass p-6 rounded-2xl border border-white/5">
        <div className="text-[10px] font-mono text-white/40 mb-2 uppercase">{label}</div>
        <div className="text-3xl font-bold neon-text mb-1">{value}</div>
        <div className="text-[10px] text-green-400">▲ {change} FROM LAST PERIOD</div>
    </div>
);

const ProductsView = ({ products }: { products: Product[] }) => {
    const [showAdd, setShowAdd] = useState(false);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black uppercase tracking-tighter">Asset Management</h1>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="flex items-center gap-2 px-6 py-3 bg-neon-blue text-obsidian font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                >
                    <Plus className="w-4 h-4" />
                    Forge New Asset
                </button>
            </div>

            {showAdd && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-8 rounded-2xl border border-neon-blue/30"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <InputField label="Asset Name" placeholder="e.g. Apex Strider v2" />
                            <InputField label="Encryption Price (Ξ)" placeholder="0.00" />
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="Units" placeholder="100" />
                                <InputField label="Category" placeholder="Hardware/Apparel" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <label className="text-[10px] font-mono text-white/40 uppercase">Visual Identity</label>
                            <div className="flex-1 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-4 hover:border-neon-blue/50 transition-all cursor-pointer group">
                                <ImageIcon className="w-8 h-8 text-white/20 group-hover:neon-text transition-all" />
                                <span className="text-[10px] font-mono text-white/20">UPLOAD TEXTURE PACK (MAX 10MB)</span>
                            </div>
                            <button className="w-full py-4 bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neon-blue hover:text-obsidian transition-all">
                                Confirm Asset Initialization
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-left font-mono text-xs uppercase">
                    <thead className="bg-white/5 text-white/40">
                        <tr>
                            <th className="p-4 px-6">Asset ID</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Units</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right px-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {products.map(p => (
                            <ProductRow key={p.id} id={`AS-${p.id}`} name={p.name} price={p.price.toLocaleString()} stock={p.stock} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const InputField = ({ label, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{label}</label>
        <input
            {...props}
            className="w-full bg-obsidian-light border border-white/10 rounded-lg p-3 text-xs outline-none focus:border-neon-blue/50 transition-all font-mono"
        />
    </div>
);

const ProductRow = ({ id, name, price, stock }: any) => (
    <tr className="hover:bg-white/5 transition-colors group">
        <td className="p-4 px-6 text-neon-blue/60">{id}</td>
        <td className="p-4 font-bold text-white">{name}</td>
        <td className="p-4">${price}</td>
        <td className="p-4">{stock}</td>
        <td className="p-4 text-green-400">SYNCED</td>
        <td className="p-4 text-right px-6">
            <button className="p-2 hover:text-neon-blue opacity-40 hover:opacity-100 transition-all"><Trash className="w-4 h-4" /></button>
        </td>
    </tr>
);

const OrdersView = ({ orders }: { orders: Order[] }) => (
    <div className="space-y-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Transaction Logs</h1>
        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-left font-mono text-xs uppercase">
                <thead className="bg-white/5 text-white/40">
                    <tr>
                        <th className="p-4 px-6">Packet ID</th>
                        <th className="p-4">Entity</th>
                        <th className="p-4">Value</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 px-6 text-right">Time</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {orders.map(o => (
                        <OrderRow
                            key={o.id}
                            id={`TX-${o.id}`}
                            user={`User_${o.userId}`} // Mapping user ID since we didn't fetch username yet
                            val={o.totalPrice.toLocaleString()}
                            status={o.status.toUpperCase()}
                            isPending={o.status === 'pending'}
                            time={new Date(o.createdAt).toLocaleTimeString()}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const OrderRow = ({ id, user, val, status, isPending, time }: any) => (
    <tr className="hover:bg-white/5 transition-colors group">
        <td className="p-4 px-6 text-white/40">{id}</td>
        <td className="p-4 font-bold text-white tracking-widest">{user}</td>
        <td className="p-4 text-neon-blue">${val}</td>
        <td className="p-4">
            <span className={`px-2 py-1 rounded text-[8px] font-bold ${isPending ? 'bg-neon-purple/20 text-neon-purple' : 'bg-green-400/10 text-green-400'}`}>
                {status}
            </span>
        </td>
        <td className="p-4 px-6 text-right text-white/40">{time}</td>
    </tr>
);
