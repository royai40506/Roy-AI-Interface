import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '@/context/AppContext';
import { FileText } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(message.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mr-3 mt-1 shadow-[0_0_10px_rgba(var(--primary),0.1)]">
          <span className="text-primary font-semibold text-sm">R</span>
        </div>
      )}
      
      <div className={`max-w-[80%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div 
          className={`
            relative px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm
            ${isUser 
              ? 'bg-gradient-to-br from-primary to-[hsl(var(--primary))] text-primary-foreground rounded-tr-sm' 
              : 'bg-card text-card-foreground border border-border/50 rounded-tl-sm'
            }
          `}
          style={isUser ? {
            background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)`
          } : {}}
        >
          {message.attachedFile && (
            <div className={`flex items-center gap-2 mb-2 p-2 rounded-lg text-xs ${isUser ? 'bg-black/20' : 'bg-background'}`}>
              <FileText className="w-4 h-4" />
              <span className="truncate max-w-[150px] font-medium">{message.attachedFile}</span>
            </div>
          )}
          
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        </div>
        
        <span className="text-[10px] text-muted-foreground mt-1.5 px-1 font-medium tracking-wide opacity-70">
          {formattedTime}
        </span>
      </div>
    </motion.div>
  );
}
