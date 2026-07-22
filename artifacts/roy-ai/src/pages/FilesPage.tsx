import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Plus, FolderOpen, FileText, Image as ImageIcon, FileCode, Trash2 } from 'lucide-react';
import { useAppContext, type UploadedFile } from '@/context/AppContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function FilesPage() {
  const { language, setSidebarOpen, files, addFile, deleteFile } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    title: language === 'en' ? 'Files' : 'फ़ाइलें',
    upload: language === 'en' ? 'Upload' : 'अपलोड करें',
    storage: language === 'en' ? 'Storage' : 'स्टोरेज',
    filesCount: language === 'en' ? 'files' : 'फ़ाइलें',
    used: language === 'en' ? 'used' : 'उपयोग किया',
    noFiles: language === 'en' ? 'No files yet' : 'अभी तक कोई फ़ाइल नहीं',
    noFilesDesc: language === 'en' ? 'Upload files to share with Roy.' : 'Roy के साथ साझा करने के लिए फ़ाइलें अपलोड करें।',
    deleteTitle: language === 'en' ? 'Delete File?' : 'फ़ाइल हटाएं?',
    deleteDesc: language === 'en' ? 'This file will be permanently deleted.' : 'यह फ़ाइल स्थायी रूप से हटा दी जाएगी।',
    cancel: language === 'en' ? 'Cancel' : 'रद्द करें',
    delete: language === 'en' ? 'Delete' : 'हटाएं',
  };

  // Calculate total storage
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const totalSizeKB = (totalSize / 1024).toFixed(1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Create file entry
    addFile({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type || getFileExtension(selectedFile.name),
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return ext;
  };

  const getFileIcon = (file: UploadedFile) => {
    const type = file.type.toLowerCase();
    const ext = getFileExtension(file.name);

    if (type.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) {
      return ImageIcon;
    }
    if (
      ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json', 'xml'].includes(ext)
    ) {
      return FileCode;
    }
    return FileText;
  };

  const getFileIconColor = (file: UploadedFile) => {
    const type = file.type.toLowerCase();
    const ext = getFileExtension(file.name);

    if (type.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) {
      return 'text-green-400';
    }
    if (
      ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'json', 'xml'].includes(ext)
    ) {
      return 'text-blue-400';
    }
    return 'text-muted-foreground';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'hi-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

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
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all"
          data-testid="button-upload-file"
        >
          <Plus className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
        accept=".png,.jpg,.jpeg,.webp,.csv,.xlsx,.xls,.pdf"
          className="hidden"
          onChange={handleFileUpload}
          data-testid="input-file-upload"
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Storage Indicator */}
        <div className="bg-card rounded-2xl border border-border/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">{t.storage}</span>
            <span className="text-xs text-muted-foreground">
              {files.length} {t.filesCount} • {totalSizeKB} KB {t.used}
            </span>
          </div>
          <div className="h-2 bg-background rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalSize / (10 * 1024 * 1024)) * 100, 100)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full"
            />
          </div>
        </div>

        {/* File List */}
        {files.length > 0 ? (
          <div className="space-y-3 pb-4">
            <AnimatePresence mode="popLayout">
              {files.map((file, index) => {
                const FileIcon = getFileIcon(file);
                const iconColor = getFileIconColor(file);

                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className="bg-card rounded-2xl border border-border/40 p-4 flex items-center gap-3"
                    data-testid={`card-file-${file.id}`}
                  >
                    {/* File Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-background border border-border/30 flex items-center justify-center ${iconColor}`}>
                      <FileIcon className="w-5 h-5" />
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground truncate">{file.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{formatDate(file.uploadedAt)}</span>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          data-testid={`button-delete-file-${file.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border sm:max-w-md w-[90vw] rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-foreground">{t.deleteTitle}</AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground">
                            {t.deleteDesc}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row justify-end gap-3 sm:gap-3">
                          <AlertDialogCancel className="mt-0 border-border bg-background hover:bg-muted text-foreground">
                            {t.cancel}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteFile(file.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {t.delete}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <FolderOpen className="w-10 h-10 text-primary/30" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{t.noFiles}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">{t.noFilesDesc}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-lg shadow-primary/20 transition-all"
              data-testid="button-upload-empty-state"
            >
              {t.upload}
            </button>
               className="mt-3 w-full px-6 py-3 rounded-xl border border-primary text-primary hover:bg-primary/10 font-medium"
>
  Manual Data Entry
</button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
