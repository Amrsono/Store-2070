"use client";

import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CyberObject = () => {
    const mesh = useRef<THREE.Mesh>(null!);
    const [hovered, setHover] = useState(false);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.x = Math.cos(t / 4) / 4;
        mesh.current.rotation.y = Math.sin(t / 4) / 4;
        mesh.current.rotation.z = Math.sin(t / 4) / 4;
        mesh.current.position.y = Math.sin(t / 2) / 10;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh
                ref={mesh}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <octahedronGeometry args={[2, 0]} />
                <MeshDistortMaterial
                    color={hovered ? "#00f2ff" : "#00d4ff"}
                    speed={hovered ? 4 : 2}
                    distort={0.4}
                    radius={1}
                    emissive="#00f2ff"
                    emissiveIntensity={hovered ? 2 : 0.5}
                    attach="material"
                />
            </mesh>
        </Float>
    );
};

const ParticleField = ({ count = 500 }) => {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 20;
            p[i * 3 + 1] = (Math.random() - 0.5) * 20;
            p[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return p;
    }, [count]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length / 3}
                    array={points}
                    itemSize={3}
                    args={[points, 3]}
                />
            </bufferGeometry>
            <pointsMaterial size={0.02} color="#00f2ff" transparent opacity={0.4} />
        </points>
    );
};

import { useParams } from 'next/navigation';

export const Hero = () => {
    const params = useParams();
    const isArabic = params?.locale === 'ar';

    const t = {
        subtitle: isArabic ? 'موضة المستقبل الرقمية' : 'Next-Gen Cyberwear & Kicks',
        title: isArabic ? 'أزياء المستقبل' : 'Future Fashion',
        loading: isArabic ? 'جار التحميل' : 'Now Loading',
        desc: isArabic ? 'أحذية مضادة للجاذبية. سترات ذكية. أقمشة متكيفة. ارتقِ بأسلوبك إلى عام 2070.' : 'Anti-grav footwear. Smart jackets. Adaptive fabrics. Upgrade your aesthetic to the year 2070.',
        login: isArabic ? 'تسجيل الدخول' : 'Login',
        register: isArabic ? 'سجل الآن' : 'Register now!',
        status: isArabic ? 'حالة النظام: مثالية' : 'SYSTEM STATUS: OPTIMAL',
        loc: isArabic ? 'الموقع: نيو-طوكيو عقدة 7' : 'LOCATION: NEO-TOKYO NODE 7'
    };
    return (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-obsidian">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-purple/10 blur-[120px] rounded-full"></div>

            {/* 3D Canvas */}
            <div className="absolute inset-0 z-0">
                <Canvas shadows>
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bc13fe" />
                    <CyberObject />
                    <ParticleField />
                    <Environment preset="city" />
                </Canvas>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-neon-blue font-mono tracking-[0.3em] mb-4 text-sm uppercase">{t.subtitle}</h2>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase">
                        {t.title} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">{t.loading}</span>
                    </h1>
                    <p className="max-w-xl mx-auto text-white/50 text-lg mb-8 font-light">
                        {t.desc}
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link href="/login">
                            <button className="px-8 py-4 bg-neon-blue text-obsidian font-bold uppercase tracking-widest hover:bg-white transition-all neon-border">
                                {t.login}
                            </button>
                        </Link>
                        <Link href="/register">
                            <button className="px-8 py-4 glass text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/20">
                                {t.register}
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* HUD Elements */}
            <div className="absolute bottom-10 left-10 hidden lg:block font-mono text-[10px] text-neon-blue/50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neon-blue animate-pulse rounded-full"></div>
                    SYSTEM STATUS: OPTIMAL
                </div>
                <div>ENCRYPTION: AES-Q-4096</div>
                <div>LOCATION: NEO-TOKYO NODE 7</div>
            </div>
        </div>
    );
};
