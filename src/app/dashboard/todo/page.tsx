'use client';

import * as React from 'react';
import { usePlacementStore, TodoTask } from '@/store/usePlacementStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Trash2, Plus, Edit2, Check, X, ChevronDown, Lock } from 'lucide-react';
import { format } from 'date-fns';

const tagColors: Record<string, string> = {
  'Backend Web': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'Core': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'AI': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'DSA': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  'Aptitude': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

const availableTags = Object.keys(tagColors);

export default function TodoPage() {
  const store = usePlacementStore();
  const todos = store.todos || [];
  
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const [editTag, setEditTag] = React.useState('');
  
  const [isAdding, setIsAdding] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [newTag, setNewTag] = React.useState('DSA');

  const startEditing = (task: TodoTask) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditTag(task.tag);
  };

  const saveEdit = (taskId: string) => {
    if (editTitle.trim()) {
      store.updateTodo(taskId, { title: editTitle, tag: editTag });
    }
    setEditingId(null);
  };

  const saveNew = () => {
    if (newTitle.trim()) {
      store.addTodo({ title: newTitle, tag: newTag, completed: false });
      setNewTitle('');
      setIsAdding(false);
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6 pb-20">
      {/* Header and Progress */}
      <GlassCard className="p-6 space-y-6">
        <h1 className="text-xl font-bold font-mono text-emerald-400">General To-Do Tasks</h1>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-mono text-muted-foreground">
            <span>Overall completion</span>
            <span>{completedCount}/{totalCount} tasks &bull; {progressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </GlassCard>

      {!store.isAdmin && (
        <div className="flex items-center gap-2 px-4 py-3 bg-secondary/30 border border-border/50 rounded-lg text-xs font-mono text-muted-foreground">
          <Lock className="w-3.5 h-3.5" />
          <span>You're viewing in read-only mode. Only the admin can add or update tasks.</span>
        </div>
      )}

      {/* Task List */}
      <GlassCard className="p-6">
        <div className="space-y-2">
          {todos.length === 0 && !isAdding && (
            <div className="text-sm text-muted-foreground font-mono italic py-8 text-center">
              No tasks added yet. You're all caught up!
            </div>
          )}

          {todos.map((task) => (
            <div key={task.id} className="group flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-transparent hover:border-border/40 transition-colors gap-2">
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
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500 hover:text-emerald-400 shrink-0" onClick={() => saveEdit(task.id)}><Check className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-400 shrink-0" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <Checkbox 
                      id={task.id} 
                      checked={task.completed} 
                      disabled={!store.isAdmin}
                      onCheckedChange={() => store.isAdmin && store.toggleTodo(task.id)}
                      className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 mt-0.5 disabled:opacity-50 shrink-0"
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
                  
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 ml-7 sm:ml-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {format(new Date(task.createdAt), 'MMM dd')}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`font-mono text-xs font-normal whitespace-nowrap ${tagColors[task.tag] || tagColors['DSA']}`}
                      >
                        {task.tag}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      {store.isAdmin && (
                        <>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0" onClick={() => startEditing(task)}>
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-red-400 shrink-0" onClick={() => store.deleteTodo(task.id)}>
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

          {isAdding ? (
            <div className="flex items-center gap-3 w-full bg-secondary/30 p-1.5 rounded-lg border border-border/50 mt-4">
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
              <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500 hover:text-emerald-400 shrink-0" onClick={saveNew}><Check className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-400 shrink-0" onClick={() => { setIsAdding(false); setNewTitle(''); }}><X className="w-4 h-4" /></Button>
            </div>
          ) : store.isAdmin ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-4 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 font-mono text-xs h-8"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Task
            </Button>
          ) : null}
        </div>
      </GlassCard>
    </div>
  );
}
