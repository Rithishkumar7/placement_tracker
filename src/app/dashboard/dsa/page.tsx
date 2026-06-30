'use client';

import { usePlacementStore } from '@/store/usePlacementStore';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DSAPage() {
  const store = usePlacementStore();
  const { dsaStats } = store;

  const totalTopics = dsaStats.topics.length;
  const completedTopics = dsaStats.topics.filter(t => t.completed).length;
  const progressPercent = totalTopics ? (completedTopics / totalTopics) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Structures & Algorithms</h1>
        <p className="text-muted-foreground">Track your DSA preparation and problem-solving stats.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard>
          <GlassCardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Solved</p>
            <h3 className="text-4xl font-black text-foreground mt-2">{dsaStats.totalSolved}</h3>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="p-6">
            <p className="text-sm font-medium text-green-500">Easy</p>
            <h3 className="text-3xl font-black text-foreground mt-2">{dsaStats.easy}</h3>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="p-6">
            <p className="text-sm font-medium text-yellow-500">Medium</p>
            <h3 className="text-3xl font-black text-foreground mt-2">{dsaStats.medium}</h3>
          </GlassCardContent>
        </GlassCard>
        <GlassCard>
          <GlassCardContent className="p-6">
            <p className="text-sm font-medium text-red-500">Hard</p>
            <h3 className="text-3xl font-black text-foreground mt-2">{dsaStats.hard}</h3>
          </GlassCardContent>
        </GlassCard>
      </div>

      <GlassCard>
        <GlassCardHeader>
          <GlassCardTitle>Topic Completion</GlassCardTitle>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">{completedTopics} of {totalTopics} completed</span>
            <span className="text-sm font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2 mt-2" />
        </GlassCardHeader>
        <GlassCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {dsaStats.topics.map((topic) => (
              <div key={topic.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-secondary/20">
                <span className="font-medium">{topic.name}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  {topic.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
}
