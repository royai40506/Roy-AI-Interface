import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import ChatHeader from '@/components/ChatHeader';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import InputBar from '@/components/InputBar';

const mockResponsesEN = [
  "That's an interesting thought! I'm still learning, but here's what I think: every question deserves a thoughtful answer. What else would you like to explore?",
  "Great question! I've analyzed your input and here's my take: complexity often hides simplicity underneath. Let me help you break it down.",
  "I understand what you're asking. While I'm working on my full capabilities, I can tell you that the best insights often come from asking the right questions.",
  "Fascinating! I'm processing that. Here's a perspective: the future of AI is collaborative — humans and AI thinking together, not apart."
];

const mockResponsesHI = [
  "यह बहुत अच्छा सवाल है! मैं आपकी बात समझता हूं। हर सवाल का एक अच्छा जवाब होता है — आइए मिलकर सोचते हैं।",
  "बिल्कुल सही! आपने जो पूछा वो बहुत महत्वपूर्ण है। मैं आपकी मदद के लिए हमेशा यहां हूं।",
  "दिलचस्प! मैं इस पर सोच रहा हूं। ज्ञान और समझ साथ मिलकर बढ़ते हैं — चलिए आगे बढ़ते हैं।",
  "बहुत बढ़िया सवाल! AI और इंसान मिलकर बेहतर भविष्य बना सकते हैं। आप क्या सोचते हैं?"
];

export default function ChatPage() {
  const { messages, addMessage, language } = useAppContext();
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const responseCountRef = useRef(0);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (content: string, attachedFile?: string) => {
    addMessage({
      role: 'user',
      content,
      attachedFile
    });

    setIsTyping(true);

    // Simulate network delay and typing
    setTimeout(() => {
      const responses = language === 'en' ? mockResponsesEN : mockResponsesHI;
      const index = responseCountRef.current % responses.length;
      responseCountRef.current += 1;
      
      addMessage({
        role: 'assistant',
        content: responses[index]
      });
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <ChatHeader />
      
      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-2 relative z-10 scroll-smooth" ref={scrollRef}>
        <div className="max-w-3xl mx-auto flex flex-col min-h-full justify-end">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </main>
      
      <InputBar onSend={handleSend} disabled={isTyping} />
    </div>
  );
}
