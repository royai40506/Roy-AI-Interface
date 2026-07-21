import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, Send, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

interface InputBarProps {
  onSend: (content: string, attachedFile?: string) => void;
  disabled?: boolean;
}

export default function InputBar({ onSend, disabled }: InputBarProps) {
  const { language } = useAppContext();
  const [text, setText] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if ((!text.trim() && !attachedFile) || disabled) return;
    onSend(text.trim(), attachedFile || undefined);
    setText('');
    setAttachedFile(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file.name);
    }
    // Reset file input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMicPress = () => {
    setIsRecording(true);
  };

  const handleMicRelease = () => {
    if (isRecording) {
      setIsRecording(false);
      setText((prev) => prev ? prev + ' 🎤 Voice message' : '🎤 Voice message');
    }
  };

  const placeholder = language === 'en' ? 'Message Roy...' : 'Roy को संदेश करें...';
  const hasContent = text.trim().length > 0 || attachedFile;

  return (
    <div className="flex-shrink-0 p-4 pb-safe bg-background/90 backdrop-blur-xl border-t border-border/40 relative z-20">
      
      <AnimatePresence>
        {attachedFile && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 inline-flex items-center gap-2 bg-card border border-border/50 px-3 py-1.5 rounded-full shadow-sm"
          >
            <Paperclip className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium truncate max-w-[200px]">{attachedFile}</span>
            <button 
              onClick={() => setAttachedFile(null)}
              className="ml-1 p-0.5 rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-2 max-w-3xl mx-auto">
        <div className="flex-1 bg-card rounded-3xl border border-border/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all flex items-end pl-2 pr-1 py-1 min-h-[52px]">
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors mb-0.5"
            disabled={disabled}
            data-testid="button-attach"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? (language === 'en' ? 'Listening...' : 'सुन रहा हूँ...') : placeholder}
            disabled={disabled || isRecording}
            className="flex-1 max-h-[120px] min-h-[24px] bg-transparent resize-none outline-none py-3 px-1 text-[15px] placeholder:text-muted-foreground/60 scrollbar-hide text-foreground my-auto"
            rows={1}
          />

          {hasContent && !isRecording ? (
            <button
              onClick={handleSend}
              disabled={disabled}
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity mb-0.5 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
              data-testid="button-send"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          ) : (
            <div className="relative mb-0.5 w-10 h-10 flex items-center justify-center">
              {isRecording && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  animate={{ scale: [1, 1.5, 2], opacity: [1, 0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              {isRecording && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
              <button
                onMouseDown={handleMicPress}
                onMouseUp={handleMicRelease}
                onMouseLeave={handleMicRelease}
                onTouchStart={handleMicPress}
                onTouchEnd={handleMicRelease}
                disabled={disabled}
                className={`relative z-10 w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                  isRecording 
                    ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.5)]' 
                    : 'bg-transparent text-muted-foreground hover:text-primary hover:bg-primary/10'
                }`}
                data-testid="button-mic"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
