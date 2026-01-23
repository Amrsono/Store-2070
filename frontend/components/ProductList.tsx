"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
}

export const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8000/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
              query {
                products {
                  id
                  name
                  description
                  price
                  imageUrl
                }
              }
            `
                    })
                });
                const data = await response.json();
                setProducts(data.data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
                // Fallback data if backend is not reachable or failed
                setProducts([
                    { id: '1', name: 'Void Walker v3', description: 'Quantum-stitched combat boots', price: 2400, image_url: '' },
                    { id: '2', name: 'Neon Weave Jacket', description: 'Adaptive color-shifting bomber', price: 3200, image_url: '' },
                    { id: '3', name: 'Chroma Sneakers', description: 'Kinetic energy harvesting', price: 1800, image_url: '' },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div className="text-center py-20 neon-text animate-pulse font-mono uppercase">Initializing Product Stream...</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-bold text-white uppercase tracking-tighter mb-2">New Arrivals</h2>
                    <p className="text-white/50 font-mono text-sm uppercase tracking-widest">2070 Summer/Fall Collection</p>
                </div>
                <div className="text-[10px] font-mono text-neon-blue/40 uppercase">Filter: ALL_APPAREL</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group glass p-1 rounded-2xl border border-white/5 hover:border-neon-blue/30 transition-all overflow-hidden"
                    >
                        <div className="relative h-64 bg-obsidian-light rounded-xl overflow-hidden mb-4">
                            <div className="absolute inset-0 bg-gradient-to-t from-obsidian to-transparent opacity-60"></div>
                            {/* Placeholder for product decoration */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 border border-neon-blue/20 rotate-45 group-hover:rotate-90 group-hover:border-neon-blue/50 transition-all duration-700"></div>
                                <div className="absolute w-20 h-20 border border-neon-purple/20 -rotate-45 group-hover:-rotate-90 group-hover:border-neon-purple/50 transition-all duration-700"></div>
                            </div>
                            <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-[10px] font-mono text-neon-blue">
                                IN STOCK: {10 + idx * 5}
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-white group-hover:text-neon-blue transition-colors uppercase tracking-tight">
                                    {product.name}
                                </h3>
                                <span className="font-mono text-neon-purple font-bold">${product.price.toLocaleString()}</span>
                            </div>
                            <p className="text-white/40 text-sm mb-6 line-clamp-2 uppercase tracking-wide">
                                {product.description}
                            </p>

                            <button className="w-full py-3 glass border border-white/10 group-hover:neon-border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-all">
                                <Plus className="w-4 h-4" />
                                Add to Cipher
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
