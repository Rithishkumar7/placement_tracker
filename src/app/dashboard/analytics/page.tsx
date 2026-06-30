'use client';

import { usePlacementStore } from '@/store/usePlacementStore';
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from '@/components/ui/GlassCard';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export default function AnalyticsPage() {
  const store = usePlacementStore();

  // Mock data for charts
  const weeklyStudyData = [
    { name: 'Mon', hours: 2 },
    { name: 'Tue', hours: 3 },
    { name: 'Wed', hours: 4 },
    { name: 'Thu', hours: 2.5 },
    { name: 'Fri', hours: 5 },
    { name: 'Sat', hours: 6 },
    { name: 'Sun', hours: 4 },
  ];

  const radarData = [
    { subject: 'DSA', A: 80, fullMark: 100 },
    { subject: 'Aptitude', A: 65, fullMark: 100 },
    { subject: 'SQL', A: 90, fullMark: 100 },
    { subject: 'Core', A: 40, fullMark: 100 },
    { subject: 'Sys Design', A: 20, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Detailed insights into your preparation progress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Study Hours (This Week)</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyStudyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#003d1f" vertical={false} />
                <XAxis dataKey="name" stroke="#86efac" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#86efac" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#001e0f', borderColor: '#003d1f', color: '#f0fdf4' }}
                  itemStyle={{ color: '#22c55e' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCardContent>
        </GlassCard>

        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Skill Radar</GlassCardTitle>
          </GlassCardHeader>
          <GlassCardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#003d1f" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#86efac', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Readiness" dataKey="A" stroke="#22c55e" strokeWidth={2} fill="#22c55e" fillOpacity={0.4} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#001e0f', borderColor: '#003d1f', color: '#f0fdf4' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </GlassCardContent>
        </GlassCard>
      </div>
    </div>
  );
}
