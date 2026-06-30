'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { format, subDays, startOfWeek, addDays, getDay } from 'date-fns';

interface ContributionGraphProps {
  data: { date: string; value: number }[];
  days: number;
  className?: string;
}

export function ContributionGraph({ data, days = 92, className }: ContributionGraphProps) {
  // Generate dates
  const today = new Date('2026-09-30'); // Using End date as reference for full graph, but ideally should be current date. 
  // Let's use the current date or end date based on props.
  // Actually, we should just use an array of last `days` days.
  const dates = Array.from({ length: days }).map((_, i) => {
    return subDays(today, days - 1 - i);
  });

  const getIntensity = (value: number) => {
    if (value === 0) return 'bg-secondary';
    if (value < 2) return 'bg-primary/40';
    if (value < 4) return 'bg-primary/60';
    if (value < 6) return 'bg-primary/80';
    return 'bg-primary';
  };

  // Group by weeks for the grid layout
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  // Pad the first week if it doesn't start on Sunday
  const firstDay = dates[0];
  const dayOfWeek = getDay(firstDay);
  if (dayOfWeek > 0) {
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek.push(subDays(firstDay, dayOfWeek - i));
    }
  }

  dates.forEach(date => {
    currentWeek.push(date);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const dataMap = new Map(data.map(d => [d.date, d.value]));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-1 overflow-x-auto pb-2 custom-scrollbar">
        {weeks.map((week, wIndex) => (
          <div key={wIndex} className="flex flex-col gap-1">
            {week.map((date, dIndex) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const value = dataMap.get(dateStr) || 0;
              const isFuture = date > new Date('2026-06-30'); // Example logic for future dates
              
              // Only render actual dates within our range or pad them with invisible blocks
              const isPadding = date < dates[0];
              
              if (isPadding) {
                return <div key={dIndex} className="w-3 h-3 rounded-sm opacity-0" />;
              }

              return (
                <div
                  key={dIndex}
                  className={cn(
                    "w-3 h-3 rounded-sm transition-colors duration-300",
                    isFuture && value === 0 ? "bg-secondary/50 border border-border/50" : getIntensity(value)
                  )}
                  title={`${dateStr}: ${value} hours`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mt-2">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-secondary" />
          <div className="w-3 h-3 rounded-sm bg-primary/40" />
          <div className="w-3 h-3 rounded-sm bg-primary/60" />
          <div className="w-3 h-3 rounded-sm bg-primary/80" />
          <div className="w-3 h-3 rounded-sm bg-primary" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
