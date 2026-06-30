'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Activity, Map, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard, GlassCardContent } from '@/components/ui/GlassCard';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-white/5 bg-background/50 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <span className="text-primary-foreground font-black text-xl">P</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">RoadToOffer</span>
          </div>
          <Link href="/dashboard">
            <Button className="rounded-full px-6 font-semibold shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Target: September 2026 Placements</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-tight"
            >
              Master Your <span className="text-gradient">Placement</span> Journey
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
            >
              The ultimate 90-day dashboard to track DSA, Aptitude, Core Subjects, and System Design until you secure that dream offer.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link href="/dashboard">
                <Button size="lg" className="h-16 px-10 text-lg rounded-full font-bold shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)] transition-all gap-3">
                  Start Your Journey <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Track Progress", desc: "Monitor your overall readiness score daily.", icon: Target },
              { title: "Maintain Streaks", desc: "Build consistency with daily study streaks.", icon: Activity },
              { title: "90-Day Roadmap", desc: "Follow a curated day-by-day preparation plan.", icon: Map },
              { title: "Achievements", desc: "Earn badges as you hit your milestones.", icon: Trophy },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              >
                <GlassCard className="h-full hover:bg-card/60 transition-colors">
                  <GlassCardContent className="p-6 flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </GlassCardContent>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
