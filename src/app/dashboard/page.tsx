'use client';

import * as React from 'react';
import { usePlacementStore, RoadmapDay, RoadmapTask } from '@/store/usePlacementStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format, differenceInDays, isToday, isPast } from 'date-fns';
import { Trash2, Plus, Edit2, Check, X, ChevronDown, Lock } from 'lucide-react';

const tagColors: Record<string, string> = {
  'Backend Web': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'Core': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'AI': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'DSA': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  'Aptitude': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

const availableTags = Object.keys(tagColors);

function DayTasks({ day, store }: { day: RoadmapDay, store: any }) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const [editTag, setEditTag] = React.useState('');
  
  const [isAdding, setIsAdding] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newTag, setNewTag] = React.useState('DSA');

  const startEditing = (task: RoadmapTask) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditTag(task.tag);
  };

  const saveEdit = (taskId: string) => {
    if (editTitle.trim()) {
      store.updateRoadmapTask(day.dayNumber, taskId, { title: editTitle, tag: editTag });
    }
    setEditingId(null);
  };

  const saveNew = () => {
    if (newTitle.trim()) {
      store.addRoadmapTask(day.dayNumber, { title: newTitle, tag: newTag, completed: false });
      setNewTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-2 pl-12 pr-4">
      {day.tasks.map((task) => (
        <div key={task.id} className="group flex items-center justify-between py-1 border-b border-transparent hover:border-border/40 transition-colors">
          {editingId === task.id ? (
            <div className="flex items-center gap-3 w-full bg-secondary/30 p-1.5 rounded-lg border border-border/50">
              <Input 
                value={editTitle} 
                onChange={(e) => setEditTitle(e.target.value)} 
                className="h-8 text-sm font-mono flex-1 bg-background"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger className={`inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 font-mono text-xs outline-none ${tagColors[editTag] || tagColors['DSA']}`}>
                  {editTag} <ChevronDown className="w-3 h-3 ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {availableTags.map(tag => (
                    <DropdownMenuItem key={tag} onClick={() => setEditTag(tag)}>
                      <Badge variant="outline" className={`font-mono text-xs w-full ${tagColors[tag]}`}>{tag}</Badge>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-400" onClick={() => saveEdit(task.id)}><Check className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-400" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 overflow-hidden">
                <Checkbox 
                  id={task.id} 
                  checked={task.completed} 
                  disabled={!store.isAdmin}
                  onCheckedChange={() => store.isAdmin && store.toggleRoadmapTask(day.dayNumber, task.id)}
                  className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 mt-0.5 disabled:opacity-50"
                />
                <label 
                  htmlFor={task.id} 
                  className={`font-mono text-sm transition-colors truncate ${
                    task.completed ? 'text-muted-foreground line-through opacity-70' : 'text-foreground'
                  } ${store.isAdmin ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  {task.title}
                </label>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <Badge 
                  variant="outline" 
                  className={`font-mono text-xs font-normal whitespace-nowrap ${tagColors[task.tag] || tagColors['DSA']}`}
                >
                  {task.tag}
                </Badge>
                
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {store.isAdmin && (
                    <>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => startEditing(task)}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-red-400" onClick={() => store.deleteRoadmapTask(day.dayNumber, task.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      {day.tasks.length === 0 && !isAdding && (
        <div className="text-sm text-muted-foreground font-mono italic py-2">
          No tasks assigned.
        </div>
      )}

      {isAdding ? (
        <div className="flex items-center gap-3 w-full bg-secondary/30 p-1.5 rounded-lg border border-border/50 mt-2">
          <Input 
            placeholder="New task..."
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            className="h-8 text-sm font-mono flex-1 bg-background"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && saveNew()}
          />
          <DropdownMenu>
            <DropdownMenuTrigger className={`inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 font-mono text-xs outline-none ${tagColors[newTag] || tagColors['DSA']}`}>
              {newTag} <ChevronDown className="w-3 h-3 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {availableTags.map(tag => (
                <DropdownMenuItem key={tag} onClick={() => setNewTag(tag)}>
                  <Badge variant="outline" className={`font-mono text-xs w-full ${tagColors[tag]}`}>{tag}</Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-400" onClick={saveNew}><Check className="w-4 h-4" /></Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-400" onClick={() => { setIsAdding(false); setNewTitle(''); }}><X className="w-4 h-4" /></Button>
        </div>
      ) : store.isAdmin ? (
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-2 text-muted-foreground hover:text-foreground font-mono text-xs h-8"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Task
        </Button>
      ) : null}
    </div>
  );
}

export default function UnifiedDashboard() {
  const store = usePlacementStore();
  const [filter, setFilter] = React.useState<'All Days' | 'Pending' | 'Today' | 'Done'>('All Days');

  // Dates
  const startDate = new Date('2026-07-01');
  const endDate = new Date('2026-09-30');
  const today = new Date();
  const totalDays = differenceInDays(endDate, startDate);
  const currentDay = Math.max(1, Math.min(totalDays, differenceInDays(today, startDate) + 1));

  // Compute Overall Progress
  let totalTasks = 0;
  let completedTasks = 0;
  const tagCounts: Record<string, number> = {
    'DSA': 0, 'AI': 0, 'Backend Web': 0, 'Core': 0, 'Aptitude': 0
  };

  store.roadmap.forEach(day => {
    day.tasks.forEach(task => {
      totalTasks++;
      if (task.completed) completedTasks++;
      if (tagCounts[task.tag] !== undefined) {
        tagCounts[task.tag]++;
      }
    });
  });

  const completionPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const timePercent = Math.round((currentDay / totalDays) * 100);

  // Filter logic
  const filteredRoadmap = store.roadmap.filter(day => {
    if (filter === 'All Days') return true;
    if (filter === 'Today') return day.dayNumber === currentDay;
    
    const dayTotal = day.tasks.length;
    const dayCompleted = day.tasks.filter(t => t.completed).length;
    
    if (filter === 'Done') return dayTotal > 0 && dayCompleted === dayTotal;
    if (filter === 'Pending') return dayTotal === 0 || dayCompleted < dayTotal;
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Progress Section */}
      <GlassCard className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-mono text-muted-foreground">
            <span>Overall completion</span>
            <span>{completedTasks}/{totalTasks} topics &bull; {completionPercent}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${completionPercent}%` }} />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-mono text-muted-foreground">
            <span>Time elapsed</span>
            <span>{currentDay}/{totalDays} days &bull; {timePercent}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${timePercent}%` }} />
          </div>
        </div>
      </GlassCard>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <GlassCard className="p-4 space-y-2 hover:bg-card/60 transition-colors">
          <div className="text-xs font-mono text-muted-foreground font-bold tracking-wider">DSA</div>
          <div className="text-3xl font-bold text-rose-500">{tagCounts['DSA']}</div>
        </GlassCard>
        <GlassCard className="p-4 space-y-2 hover:bg-card/60 transition-colors">
          <div className="text-xs font-mono text-muted-foreground font-bold tracking-wider uppercase">AI</div>
          <div className="text-3xl font-bold text-purple-500">{tagCounts['AI']}</div>
        </GlassCard>
        <GlassCard className="p-4 space-y-2 hover:bg-card/60 transition-colors">
          <div className="text-xs font-mono text-muted-foreground font-bold tracking-wider uppercase">Backend</div>
          <div className="text-3xl font-bold text-emerald-500">{tagCounts['Backend Web']}</div>
        </GlassCard>
        <GlassCard className="p-4 space-y-2 hover:bg-card/60 transition-colors">
          <div className="text-xs font-mono text-muted-foreground font-bold tracking-wider uppercase">Core</div>
          <div className="text-3xl font-bold text-amber-500">{tagCounts['Core']}</div>
        </GlassCard>
        <GlassCard className="p-4 space-y-2 hover:bg-card/60 transition-colors">
          <div className="text-xs font-mono text-muted-foreground font-bold tracking-wider uppercase">Aptitude</div>
          <div className="text-3xl font-bold text-blue-500">{tagCounts['Aptitude']}</div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-4 space-y-2">
          <div className="text-xs font-mono text-muted-foreground font-bold tracking-wider uppercase">Completed</div>
          <div className="text-3xl font-bold text-emerald-500">{completedTasks}</div>
        </GlassCard>
        <GlassCard className="p-4 space-y-2">
          <div className="text-xs font-mono text-muted-foreground font-bold tracking-wider uppercase">Remaining</div>
          <div className="text-3xl font-bold text-amber-500">{totalTasks - completedTasks}</div>
        </GlassCard>
      </div>

      {/* Filter Tabs & Read Only Notice */}
      <div className="flex flex-wrap items-center gap-2">
        {['All Days', 'Pending', 'Today', 'Done'].map(tab => (
          <Button 
            key={tab}
            variant={filter === tab ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(tab as any)}
            className="font-mono text-xs h-8"
          >
            {tab}
          </Button>
        ))}
      </div>

      {!store.isAdmin && (
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/30 border border-border/50 rounded-lg text-xs font-mono text-muted-foreground">
          <Lock className="w-3.5 h-3.5" />
          <span>You're viewing in read-only mode. Only the admin can add or update tasks.</span>
        </div>
      )}

      {/* Accordion List */}
      <GlassCard className="p-0 overflow-hidden">
        <Accordion type="multiple" className="w-full" defaultValue={['day-1', `day-${currentDay}`]}>
          {filteredRoadmap.length > 0 ? filteredRoadmap.map((day) => {
            const dateObj = new Date(day.date);
            const dTotal = day.tasks.length;
            const dCompleted = day.tasks.filter(t => t.completed).length;
            const progressPercentage = dTotal === 0 ? 100 : (dCompleted / dTotal) * 100;
            
            return (
              <AccordionItem key={day.dayNumber} value={`day-${day.dayNumber}`} className="border-b border-border/50 px-6">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center justify-between w-full pr-4">
                    {/* Left Side: Day and Date */}
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded border border-border/50 flex items-center justify-center font-mono text-sm text-primary">
                        {day.dayNumber}
                      </div>
                      <span className="font-mono text-muted-foreground">
                        {format(dateObj, 'EEE, dd MMM')}
                      </span>
                    </div>

                    {/* Right Side: Progress */}
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-muted-foreground">
                        {dCompleted}/{dTotal}
                      </span>
                      
                      {/* Dotted indicator */}
                      <div className="hidden sm:flex gap-1">
                        {Array.from({ length: 4 }).map((_, i) => {
                          const threshold = (i + 1) * 25;
                          const isFilled = progressPercentage >= threshold;
                          const colors = ['bg-rose-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-400'];
                          return (
                            <div 
                              key={i} 
                              className={`w-1.5 h-1.5 rounded-full transition-colors ${isFilled ? colors[i] : 'bg-secondary'}`}
                            />
                          );
                        })}
                      </div>

                      {/* Line Progress Bar */}
                      <div className="w-16 sm:w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-500" 
                          style={{ width: `${progressPercentage}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="pb-6 pt-2">
                  <DayTasks day={day} store={store} />
                </AccordionContent>
              </AccordionItem>
            );
          }) : (
            <div className="p-8 text-center text-muted-foreground font-mono text-sm">
              No days found for this filter.
            </div>
          )}
        </Accordion>
      </GlassCard>
    </div>
  );
}
