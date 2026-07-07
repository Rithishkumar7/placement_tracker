'use client';

import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Link as LinkIcon, FileText, Search, Tag, X, Upload, ExternalLink, Trash2, BookOpen } from 'lucide-react';
import { usePlacementStore } from '@/store/usePlacementStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function NotesPage() {
  const { notes, addNote, deleteNote } = usePlacementStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'pdf' | 'link'>('pdf');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived state
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => note.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet);
  }, [notes]);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? note.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || tags.length === 0) {
      alert('Please provide a title and at least one tag.');
      return;
    }

    let finalUrl = url;

    if (type === 'pdf') {
      if (!file) {
        alert('Please select a PDF file.');
        return;
      }
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        
        if (data.success) {
          finalUrl = data.url;
        } else {
          alert('Upload failed: ' + data.error);
          setIsUploading(false);
          return;
        }
      } catch (err) {
        console.error('Upload error', err);
        alert('Upload failed');
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    } else {
      if (!url.trim()) {
        alert('Please provide a valid link.');
        return;
      }
    }

    addNote({
      title: title.trim(),
      type,
      url: finalUrl,
      tags
    });

    // Reset Form
    setTitle('');
    setType('pdf');
    setUrl('');
    setFile(null);
    setTags([]);
    setTagInput('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 p-8 h-screen overflow-hidden flex flex-col bg-background relative z-0 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2">My Notes</h1>
          <p className="text-muted-foreground font-medium">Manage your PDFs and important study links</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Note
        </Button>
      </div>

      <div className="flex gap-8 flex-1 min-h-0">
        {/* Sidebar / Filters */}
        <div className="w-64 flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 glass-panel bg-card/40 border-border/50"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> Filter by Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={selectedTag === null ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(null)}
              >
                All
              </Badge>
              {allTags.map(tag => (
                <Badge 
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
              {allTags.length === 0 && <p className="text-xs text-muted-foreground">No tags found.</p>}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <ScrollArea className="flex-1 pr-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
            <AnimatePresence>
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="glass-panel p-5 flex flex-col gap-4 group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${note.type === 'pdf' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {note.type === 'pdf' ? <FileText className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                      </div>
                      <h3 className="font-semibold text-foreground line-clamp-2" title={note.title}>{note.title}</h3>
                    </div>
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md text-muted-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {note.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                    <a 
                      href={note.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-primary flex items-center gap-1 hover:underline"
                    >
                      Open {note.type === 'pdf' ? 'File' : 'Link'} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredNotes.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No notes found</h3>
                <p className="text-muted-foreground max-w-sm mt-1">
                  {searchQuery || selectedTag 
                    ? "We couldn't find any notes matching your filters." 
                    : "You haven't added any notes yet. Click the Add Note button to get started."}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Add Note Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-5 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-bold">Add New Note</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-secondary rounded-full text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <Input 
                    placeholder="e.g., OSI Model Notes" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Resource Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setType('pdf')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${type === 'pdf' ? 'bg-primary/10 border-primary text-primary' : 'bg-transparent border-border hover:bg-secondary'}`}
                    >
                      <FileText className="w-4 h-4" /> Upload PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('link')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors ${type === 'link' ? 'bg-primary/10 border-primary text-primary' : 'bg-transparent border-border hover:bg-secondary'}`}
                    >
                      <LinkIcon className="w-4 h-4" /> Drive / Web Link
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {type === 'pdf' ? (
                    <>
                      <label className="text-sm font-medium text-foreground">Select PDF File</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/50'}`}
                      >
                        <input 
                          type="file" 
                          accept="application/pdf"
                          className="hidden" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                        {file ? (
                          <>
                            <FileText className="w-8 h-8 text-primary mb-2" />
                            <p className="text-sm font-medium text-foreground text-center truncate max-w-full px-4">{file.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium text-foreground">Click to browse</p>
                            <p className="text-xs text-muted-foreground mt-1">PDF files only (max 10MB)</p>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="text-sm font-medium text-foreground">Link URL</label>
                      <Input 
                        type="url"
                        placeholder="https://drive.google.com/..." 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required={type === 'link'}
                      />
                    </>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1 px-2 py-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive text-muted-foreground">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input 
                    placeholder="Type a tag and press Enter" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    onBlur={handleAddTag}
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-2 border-t border-border mt-2">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Save Note'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


