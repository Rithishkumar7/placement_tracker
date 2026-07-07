import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { addDays, format } from 'date-fns';

const mongoStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      // Small delay to ensure hydration on client doesn't conflict during SSR
      if (typeof window === 'undefined') return null;
      const res = await fetch('/api/sync', { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return data?.store ? JSON.stringify(data.store) : null;
    } catch (e) {
      console.error('Error loading store from MongoDB', e);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store: JSON.parse(value) })
      });
    } catch (e) {
      console.error('Error saving store to MongoDB', e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    // Not needed for this single-user dashboard
  }
};

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  category: 'DSA' | 'Aptitude' | 'SQL' | 'Core' | 'SystemDesign' | 'Other';
  durationMinutes: number;
}

export interface TopicProgress {
  id: string;
  name: string;
  completed: boolean;
  notesRevised: boolean;
}

export interface DailyActivity {
  date: string;
  hoursStudied: number;
  tasksCompleted: number;
}

export interface Interview {
  id: string;
  company: string;
  role: string;
  dateApplied: string;
  status: 'Applied' | 'OA' | 'Interview' | 'Offered' | 'Rejected';
  round: string;
}

export interface MockTest {
  id: string;
  date: string;
  type: 'Aptitude' | 'DSA' | 'SQL' | 'Core';
  score: number;
  total: number;
}

export interface RoadmapTask {
  id: string;
  title: string;
  completed: boolean;
  tag: string;
}

export interface TodoTask {
  id: string;
  title: string;
  completed: boolean;
  tag: string;
  createdAt: string;
}

export interface RoadmapDay {
  dayNumber: number;
  date: string;
  tasks: RoadmapTask[];
}

export interface Note {
  id: string;
  title: string;
  type: 'pdf' | 'link';
  url: string;
  tags: string[];
  createdAt: string;
}

export interface PlacementState {
  startDate: string;
  endDate: string;
  currentStreak: number;
  totalStudyHours: number;
  tasks: Task[];
  dailyActivity: DailyActivity[];
  interviews: Interview[];
  mockTests: MockTest[];
  roadmap: RoadmapDay[];
  todos: TodoTask[];
  lastTodoReminderDate: string;
  notes: Note[];

  // Tracks
  dsaStats: {
    totalSolved: number;
    easy: number;
    medium: number;
    hard: number;
    revisionCount: number;
    topics: TopicProgress[];
  };
  aptitudeStats: {
    questionsSolved: number;
    accuracy: number;
    topics: TopicProgress[];
  };
  sqlStats: {
    questionsSolved: number;
    topics: TopicProgress[];
  };
  coreStats: {
    topics: TopicProgress[];
  };
  systemDesignStats: {
    caseStudiesCompleted: number;
    topics: TopicProgress[];
  };

  // Actions
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  updateStudyHours: (date: string, hours: number) => void;
  toggleRoadmapTask: (dayNumber: number, taskId: string) => void;
  addRoadmapTask: (dayNumber: number, task: Omit<RoadmapTask, 'id'>) => void;
  updateRoadmapTask: (dayNumber: number, taskId: string, data: Partial<RoadmapTask>) => void;
  deleteRoadmapTask: (dayNumber: number, taskId: string) => void;
  
  addTodo: (task: Omit<TodoTask, 'id' | 'createdAt'>) => void;
  updateTodo: (id: string, data: Partial<TodoTask>) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  setLastTodoReminderDate: (date: string) => void;

  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  isAdmin: boolean;
  login: (u: string, p: string) => boolean;
  logout: () => void;
}

const initialTopics = {
  dsa: [
    { id: 'dsa-1', name: 'Arrays', completed: false, notesRevised: false },
    { id: 'dsa-2', name: 'Strings', completed: false, notesRevised: false },
    { id: 'dsa-3', name: 'Hashing', completed: false, notesRevised: false },
    { id: 'dsa-4', name: 'Linked List', completed: false, notesRevised: false },
    { id: 'dsa-5', name: 'Stack', completed: false, notesRevised: false },
    { id: 'dsa-6', name: 'Queue', completed: false, notesRevised: false },
    { id: 'dsa-7', name: 'Binary Search', completed: false, notesRevised: false },
    { id: 'dsa-8', name: 'Recursion', completed: false, notesRevised: false },
    { id: 'dsa-9', name: 'Trees', completed: false, notesRevised: false },
    { id: 'dsa-10', name: 'BST', completed: false, notesRevised: false },
    { id: 'dsa-11', name: 'Heaps', completed: false, notesRevised: false },
    { id: 'dsa-12', name: 'Tries', completed: false, notesRevised: false },
    { id: 'dsa-13', name: 'Graphs', completed: false, notesRevised: false },
    { id: 'dsa-14', name: 'Dynamic Programming', completed: false, notesRevised: false },
    { id: 'dsa-15', name: 'Greedy', completed: false, notesRevised: false },
    { id: 'dsa-16', name: 'Backtracking', completed: false, notesRevised: false },
  ],
  aptitude: [
    { id: 'apt-1', name: 'Quantitative Aptitude', completed: false, notesRevised: false },
    { id: 'apt-2', name: 'Logical Reasoning', completed: false, notesRevised: false },
    { id: 'apt-3', name: 'Verbal Ability', completed: false, notesRevised: false },
    { id: 'apt-4', name: 'Data Interpretation', completed: false, notesRevised: false },
  ],
  sql: [
    { id: 'sql-1', name: 'Basic Queries', completed: false, notesRevised: false },
    { id: 'sql-2', name: 'Joins', completed: false, notesRevised: false },
    { id: 'sql-3', name: 'Group By', completed: false, notesRevised: false },
    { id: 'sql-4', name: 'Subqueries', completed: false, notesRevised: false },
    { id: 'sql-5', name: 'Window Functions', completed: false, notesRevised: false },
    { id: 'sql-6', name: 'CTE', completed: false, notesRevised: false },
    { id: 'sql-7', name: 'Indexing', completed: false, notesRevised: false },
    { id: 'sql-8', name: 'Normalization', completed: false, notesRevised: false },
  ],
  core: [
    { id: 'core-1', name: 'OS: Processes & Threads', completed: false, notesRevised: false },
    { id: 'core-2', name: 'OS: Scheduling & Deadlocks', completed: false, notesRevised: false },
    { id: 'core-3', name: 'OS: Memory Management', completed: false, notesRevised: false },
    { id: 'core-4', name: 'CN: OSI & TCP/IP', completed: false, notesRevised: false },
    { id: 'core-5', name: 'CN: Routing & Protocols', completed: false, notesRevised: false },
    { id: 'core-6', name: 'DBMS: ER Model & Normalization', completed: false, notesRevised: false },
    { id: 'core-7', name: 'DBMS: Transactions & Concurrency', completed: false, notesRevised: false },
    { id: 'core-8', name: 'DBMS: Indexing', completed: false, notesRevised: false },
  ],
  systemDesign: [
    { id: 'sd-1', name: 'Scalability & Load Balancing', completed: false, notesRevised: false },
    { id: 'sd-2', name: 'Caching', completed: false, notesRevised: false },
    { id: 'sd-3', name: 'Databases & CAP Theorem', completed: false, notesRevised: false },
    { id: 'sd-4', name: 'Message Queues', completed: false, notesRevised: false },
    { id: 'sd-5', name: 'Microservices', completed: false, notesRevised: false },
    { id: 'sd-6', name: 'Rate Limiting', completed: false, notesRevised: false },
  ]
};

// Generate some sample data for the upcoming dates to make the dashboard look active
const generateSampleTasks = () => {
  const tasks: Task[] = [];
  // Add some tasks for July 1st
  tasks.push({ id: 't1', title: 'Revise Arrays', completed: false, date: '2026-07-01', category: 'DSA', durationMinutes: 60 });
  tasks.push({ id: 't2', title: 'Aptitude Mock Test', completed: false, date: '2026-07-01', category: 'Aptitude', durationMinutes: 45 });
  tasks.push({ id: 't3', title: 'SQL Joins Practice', completed: false, date: '2026-07-02', category: 'SQL', durationMinutes: 60 });
  return tasks;
};

const generateRoadmap = () => {
  const roadmap: RoadmapDay[] = [];
  const startDate = new Date('2026-07-01');
  for (let i = 0; i < 92; i++) {
    const date = addDays(startDate, i);
    let tasks: RoadmapTask[] = [];
    
    if (i === 0) {
      tasks = [
        { id: `d${i}-1`, title: 'Node.js - Day 1', completed: true, tag: 'Backend Web' },
        { id: `d${i}-2`, title: 'DBMS - Day 1', completed: true, tag: 'Core' },
        { id: `d${i}-3`, title: 'DSA 1 - Contains Duplicate', completed: true, tag: 'DSA' },
      ];
    } else if (i === 1) {
      tasks = [
        { id: `d${i}-1`, title: 'Node.js - Day 2', completed: false, tag: 'Backend Web' },
        { id: `d${i}-2`, title: 'DSA 2 - Valid Anagram', completed: false, tag: 'DSA' },
      ];
    } else {
      tasks = [
        { id: `d${i}-1`, title: `DSA Revision`, completed: false, tag: 'DSA' },
        { id: `d${i}-2`, title: `Aptitude Practice`, completed: false, tag: 'Aptitude' }
      ];
    }
    
    roadmap.push({
      dayNumber: i + 1,
      date: format(date, 'yyyy-MM-dd'),
      tasks,
    });
  }
  return roadmap;
};

// Initial state pretending the user has set up their dashboard just before July 1
export const usePlacementStore = create<PlacementState>()(
  persist(
    (set) => ({
      startDate: '2026-07-01',
      endDate: '2026-09-30',
      currentStreak: 0,
      totalStudyHours: 0,
      tasks: generateSampleTasks(),
      dailyActivity: [],
      interviews: [],
      mockTests: [],
      roadmap: generateRoadmap(),
      todos: [],
      lastTodoReminderDate: "",
      notes: [],
      isAdmin: false,

      dsaStats: {
        totalSolved: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        revisionCount: 0,
        topics: initialTopics.dsa,
      },
      aptitudeStats: {
        questionsSolved: 0,
        accuracy: 0,
        topics: initialTopics.aptitude,
      },
      sqlStats: {
        questionsSolved: 0,
        topics: initialTopics.sql,
      },
      coreStats: {
        topics: initialTopics.core,
      },
      systemDesignStats: {
        caseStudiesCompleted: 0,
        topics: initialTopics.systemDesign,
      },

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      })),
      updateStudyHours: (date, hours) => set((state) => {
        const existing = state.dailyActivity.find(a => a.date === date);
        if (existing) {
          return {
            dailyActivity: state.dailyActivity.map(a => 
              a.date === date ? { ...a, hoursStudied: a.hoursStudied + hours } : a
            ),
            totalStudyHours: state.totalStudyHours + hours
          };
        }
        return {
          dailyActivity: [...state.dailyActivity, { date, hoursStudied: hours, tasksCompleted: 0 }],
          totalStudyHours: state.totalStudyHours + hours
        };
      }),
      toggleRoadmapTask: (dayNumber, taskId) => set((state) => ({
        roadmap: state.roadmap.map(day => {
          if (day.dayNumber === dayNumber) {
            return {
              ...day,
              tasks: day.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
            };
          }
          return day;
        })
      })),
      addRoadmapTask: (dayNumber, task) => set((state) => ({
        roadmap: state.roadmap.map(day => {
          if (day.dayNumber === dayNumber) {
            const newTask: RoadmapTask = { ...task, id: Math.random().toString(36).substr(2, 9) };
            return { ...day, tasks: [...day.tasks, newTask] };
          }
          return day;
        })
      })),
      updateRoadmapTask: (dayNumber, taskId, data) => set((state) => ({
        roadmap: state.roadmap.map(day => {
          if (day.dayNumber === dayNumber) {
            return {
              ...day,
              tasks: day.tasks.map(t => t.id === taskId ? { ...t, ...data } : t)
            };
          }
          return day;
        })
      })),
      deleteRoadmapTask: (dayNumber, taskId) => set((state) => ({
        roadmap: state.roadmap.map(day => {
          if (day.dayNumber === dayNumber) {
            return { ...day, tasks: day.tasks.filter(t => t.id !== taskId) };
          }
          return day;
        })
      })),
      addTodo: (task) => set((state) => ({
        todos: [
          ...state.todos, 
          { ...task, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }
        ]
      })),
      updateTodo: (id, data) => set((state) => ({
        todos: state.todos.map(t => t.id === id ? { ...t, ...data } : t)
      })),
      deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter(t => t.id !== id)
      })),
      toggleTodo: (id) => set((state) => ({
        todos: state.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      })),
      setLastTodoReminderDate: (date) => set(() => ({
        lastTodoReminderDate: date
      })),
      addNote: (note) => set((state) => ({
        notes: [
          ...state.notes,
          { ...note, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }
        ]
      })),
      updateNote: (id, data) => set((state) => ({
        notes: state.notes.map(n => n.id === id ? { ...n, ...data } : n)
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(n => n.id !== id)
      })),
      login: (u, p) => {
        if (u === 'rithesh' && p === 'rithesh07') {
          set({ isAdmin: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAdmin: false }),
    }),
    {
      name: 'placement-tracker-db',
      storage: createJSONStorage(() => mongoStorage),
    }
  )
);
