import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Plus, Search, Trash2, Brain } from 'lucide-react';
import { useAppContext, type MemoryEntry } from '@/context/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function MemoryPage() {
  const { language, setSidebarOpen, memories, addMemory, deleteMemory } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memoryToDelete, setMemoryToDelete] = useState<string | null>(null);

  // Form state
  const [newMemoryContent, setNewMemoryContent] = useState('');
  const [newMemoryCategory, setNewMemoryCategory] = useState<MemoryEntry['category']>('personal');
  const [newMemorySource, setNewMemorySource] = useState('');

  const t = {
    title: language === 'en' ? 'Memory' : 'मेमोरी',
    addMemory: language === 'en' ? 'Add Memory' : 'मेमोरी जोड़ें',
    search: language === 'en' ? 'Search memories...' : 'मेमोरी खोजें...',
    all: language === 'en' ? 'All' : 'सभी',
    personal: language === 'en' ? 'Personal' : 'व्यक्तिगत',
    preference: language === 'en' ? 'Preference' : 'प्राथमिकता',
    fact: language === 'en' ? 'Fact' : 'तथ्य',
    conversation: language === 'en' ? 'Conversation' : 'बातचीत',
    noMemories: language === 'en' ? 'No memories yet' : 'अभी तक कोई मेमोरी नहीं',
    noMemoriesDesc: language === 'en' ? 'Start adding memories to help Roy remember important details about you.' : 'Roy को आपके बारे में महत्वपूर्ण विवरण याद रखने में मदद करने के लिए मेमोरी जोड़ना शुरू करें।',
    addMemoryTitle: language === 'en' ? 'Add New Memory' : 'नई मेमोरी जोड़ें',
    addMemoryDesc: language === 'en' ? 'Add a fact or detail for Roy to remember.' : 'Roy को याद रखने के लिए एक तथ्य या विवरण जोड़ें।',
    memoryContent: language === 'en' ? 'Memory content' : 'मेमोरी सामग्री',
    category: language === 'en' ? 'Category' : 'श्रेणी',
    source: language === 'en' ? 'Source (optional)' : 'स्रोत (वैकल्पिक)',
    cancel: language === 'en' ? 'Cancel' : 'रद्द करें',
    save: language === 'en' ? 'Save' : 'सहेजें',
    deleteTitle: language === 'en' ? 'Delete Memory?' : 'मेमोरी हटाएं?',
    deleteDesc: language === 'en' ? 'This memory will be permanently deleted.' : 'यह मेमोरी स्थायी रूप से हटा दी जाएगी।',
    delete: language === 'en' ? 'Delete' : 'हटाएं',
  };

  // Filter memories
  const filteredMemories = memories.filter(m => {
    const matchesSearch = m.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddMemory = () => {
    if (!newMemoryContent.trim()) return;

    addMemory({
      content: newMemoryContent.trim(),
      category: newMemoryCategory,
      source: newMemorySource.trim() || 'Manual entry',
    });

    // Reset form
    setNewMemoryContent('');
    setNewMemoryCategory('personal');
    setNewMemorySource('');
    setAddDialogOpen(false);
  };

  const handleDeleteMemory = () => {
    if (memoryToDelete) {
      deleteMemory(memoryToDelete);
      setMemoryToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const getCategoryColor = (category: MemoryEntry['category']) => {
    switch (category) {
      case 'personal':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'preference':
        return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      case 'fact':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'conversation':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  const categories = [
    { value: 'all', label: t.all },
    { value: 'personal', label: t.personal },
    { value: 'preference', label: t.preference },
    { value: 'fact', label: t.fact },
    { value: 'conversation', label: t.conversation },
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 h-16 px-4 flex items-center justify-between border-b border-border/30 bg-background/80 backdrop-blur-md z-10 safe-top">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 active:bg-white/10 transition-colors text-foreground"
            data-testid="button-menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold tracking-tight text-foreground">{t.title}</h1>
        </div>

        <button
          onClick={() => setAddDialogOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all"
          data-testid="button-add-memory"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="pl-12 h-12 bg-card border-border/50 rounded-2xl text-foreground placeholder:text-muted-foreground/60"
            data-testid="input-search-memory"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                categoryFilter === cat.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-border'
              }`}
              data-testid={`button-filter-${cat.value}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Memory Cards */}
        {filteredMemories.length > 0 ? (
          <div className="space-y-3 pb-4">
            <AnimatePresence mode="popLayout">
              {filteredMemories.map((memory, index) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className="bg-card rounded-2xl border border-border/40 p-4 space-y-3"
                  data-testid={`card-memory-${memory.id}`}
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                        memory.category
                      )}`}
                    >
                      {t[memory.category]}
                    </span>
                    <button
                      onClick={() => {
                        setMemoryToDelete(memory.id);
                        setDeleteDialogOpen(true);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      data-testid={`button-delete-memory-${memory.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <p className="text-[15px] font-medium leading-relaxed text-foreground">{memory.content}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{memory.source}</span>
                    <span>
                      {new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'hi-IN', {
                        month: 'short',
                        day: 'numeric',
                      }).format(memory.createdAt)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Brain className="w-10 h-10 text-primary/30" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t.noMemories}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">{t.noMemoriesDesc}</p>
          </motion.div>
        )}
      </main>

      {/* Add Memory Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md w-[90vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t.addMemoryTitle}</DialogTitle>
            <DialogDescription className="text-muted-foreground">{t.addMemoryDesc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t.memoryContent}</label>
              <Textarea
                value={newMemoryContent}
                onChange={(e) => setNewMemoryContent(e.target.value)}
                placeholder={language === 'en' ? 'Enter memory content...' : 'मेमोरी सामग्री दर्ज करें...'}
                className="min-h-[100px] bg-background border-border/50 text-foreground resize-none"
                data-testid="textarea-memory-content"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t.category}</label>
              <Select value={newMemoryCategory} onValueChange={(v) => setNewMemoryCategory(v as MemoryEntry['category'])}>
                <SelectTrigger className="bg-background border-border/50 text-foreground" data-testid="select-memory-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">{t.personal}</SelectItem>
                  <SelectItem value="preference">{t.preference}</SelectItem>
                  <SelectItem value="fact">{t.fact}</SelectItem>
                  <SelectItem value="conversation">{t.conversation}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{t.source}</label>
              <Input
                value={newMemorySource}
                onChange={(e) => setNewMemorySource(e.target.value)}
                placeholder={language === 'en' ? 'e.g., Chat on Jan 15' : 'जैसे, 15 जनवरी को चैट'}
                className="bg-background border-border/50 text-foreground"
                data-testid="input-memory-source"
              />
            </div>
          </div>
          <DialogFooter className="flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              className="border-border bg-background hover:bg-muted text-foreground"
              data-testid="button-cancel-add-memory"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={handleAddMemory}
              disabled={!newMemoryContent.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-save-memory"
            >
              {t.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border sm:max-w-md w-[90vw] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">{t.deleteTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">{t.deleteDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-3 sm:gap-3">
            <AlertDialogCancel className="mt-0 border-border bg-background hover:bg-muted text-foreground" data-testid="button-cancel-delete">
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMemory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
