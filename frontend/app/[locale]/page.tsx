import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Dashboard } from '@/components/Dashboard';
import { ProductList } from '@/components/ProductList';
import { Shield, Lock, Cpu, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-obsidian text-white selection:bg-neon-blue selection:text-obsidian">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Features Grid */}
      <section className="py-24 px-6 border-y border-white/5 bg-obsidian-light/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <FeatureCard
              icon={Shield}
              title="Nano-Weave Tech"
              description="Ballistic-rated smart fabrics with self-repairing nanobots."
            />
            <FeatureCard
              icon={Lock}
              title="Bio-Metric Fit"
              description="Garments that adapt to your exact physiology in real-time."
            />
            <FeatureCard
              icon={Cpu}
              title="Haptic Feedback"
              description="Integrated sensors for tactile VR immersion and climate control."
            />
            <FeatureCard
              icon={BarChart3}
              title="Style Analytics"
              description="AI-driven trend forecasting beamed directly to your HUD."
            />
          </div>
        </div>
      </section>

      {/* Product Section */}
      <ProductList />

      {/* Dashboard Section */}
      <Dashboard />

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">Ready to wear the future?</h2>
          <p className="text-white/60 mb-12 text-lg uppercase tracking-widest font-mono">Join the elite faction of neo-fashion adopters.</p>
          <button className="px-12 py-5 bg-white text-obsidian font-black uppercase tracking-widest hover:bg-neon-blue transition-all">
            Enter the Grid
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 glass">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-neon-blue" />
            <span className="font-bold tracking-tighter uppercase">Store 2070</span>
          </div>
          <div className="flex gap-8 text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-neon-blue transition-colors">Protocols</a>
            <a href="#" className="hover:text-neon-blue transition-colors">Privacy</a>
            <a href="#" className="hover:text-neon-blue transition-colors">Terminal</a>
            <a href="#" className="hover:text-neon-blue transition-colors">Nodes</a>
          </div>
          <div className="text-[10px] font-mono text-white/20">
            © 2073 CYBERDYNE SYSTEMS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="flex flex-col gap-4 group">
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-neon-blue/50 transition-all">
        <Icon className="w-6 h-6 text-neon-blue group-hover:animate-pulse" />
      </div>
      <h3 className="text-xl font-bold uppercase tracking-tight text-white/90">{title}</h3>
      <p className="text-white/40 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
