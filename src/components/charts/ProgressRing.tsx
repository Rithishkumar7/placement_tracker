'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  colorClass?: string;
  label?: string;
  subLabel?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  className,
  colorClass = 'text-primary',
  label,
  subLabel
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const safeValue = Math.min(Math.max(value, 0), max);
  const percent = (safeValue / max) * 100;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        height={size}
        width={size}
        className="transform -rotate-90"
      >
        <circle
          className="text-muted/20"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn("transition-all duration-1000 ease-out", colorClass)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        {label ? (
          <span className="text-2xl font-bold text-foreground">{label}</span>
        ) : (
          <span className="text-2xl font-bold text-foreground">{Math.round(percent)}%</span>
        )}
        {subLabel && <span className="text-xs text-muted-foreground mt-1">{subLabel}</span>}
      </div>
    </div>
  );
}
