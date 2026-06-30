'use client';

import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard';
import { ExternalLink, BookOpen, Video, Code, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const resources = [
  {
    category: "Data Structures & Algorithms",
    items: [
      { title: "Striver's A2Z DSA Sheet", type: "course", url: "#", icon: BookOpen },
      { title: "NeetCode 150", type: "practice", url: "#", icon: Code },
      { title: "Aditya Verma DP Playlist", type: "video", url: "#", icon: Video },
    ]
  },
  {
    category: "System Design",
    items: [
      { title: "Grokking the System Design Interview", type: "course", url: "#", icon: BookOpen },
      { title: "ByteByteGo (Alex Xu)", type: "course", url: "#", icon: BookOpen },
      { title: "System Design Primer (GitHub)", type: "reading", url: "#", icon: FileText },
    ]
  },
  {
    category: "Core Subjects",
    items: [
      { title: "Gate Smashers - OS", type: "video", url: "#", icon: Video },
      { title: "Gate Smashers - DBMS", type: "video", url: "#", icon: Video },
      { title: "Kurose & Ross - Computer Networking", type: "reading", url: "#", icon: BookOpen },
    ]
  },
  {
    category: "Aptitude & Puzzles",
    items: [
      { title: "IndiaBix Aptitude", type: "practice", url: "#", icon: Code },
      { title: "Brain Stell Puzzles", type: "reading", url: "#", icon: FileText },
    ]
  }
];

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Placement Resources</h1>
        <p className="text-muted-foreground">Curated high-quality resources to accelerate your preparation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((section, index) => (
          <GlassCard key={index} className="flex flex-col">
            <GlassCardHeader>
              <GlassCardTitle className="text-xl">{section.category}</GlassCardTitle>
            </GlassCardHeader>
            <GlassCardContent className="flex-1 flex flex-col gap-4">
              {section.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md text-primary">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </a>
                </div>
              ))}
            </GlassCardContent>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
