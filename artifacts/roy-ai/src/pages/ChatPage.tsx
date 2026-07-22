import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import ChatHeader from '@/components/ChatHeader';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import InputBar from '@/components/InputBar';
import { streamChat } from '@/lib/chat-api';

// ── Mock fallback responses ──────────────────────────────────────────────────
const MOCK: Record<string, string[]> = {
  en: [
    "That's an interesting question! While I'm thinking through it, I believe the best insights come from curious minds asking the right questions.",
    "Great point! Let me share a perspective: complexity often hides simplicity underneath. How can I help you explore this further?",
    "I understand what you're asking. Here's my take: the best solutions are usually elegant and clear. What aspect would you like to dig into?",
    "Fascinating! The future is collaborative — humans and AI thinking together. What else would you like to explore?",
  ],
  hi: [
    'यह बहुत अच्छा सवाल है! मैं आपकी बात समझता हूं। हर सवाल का एक अच्छा जवाब होता है — आइए मिलकर सोचते हैं।',
    'बिल्कुल सही! आपने जो पूछा वो बहुत महत्वपूर्ण है। मैं आपकी मदद के लिए हमेशा यहां हूं।',
    'दिलचस्प! मैं इस पर सोच रहा हूं। ज्ञान और समझ साथ मिलकर बढ़ते हैं।',
    'बहुत बढ़िया सवाल! AI और इंसान मिलकर बेहतर भविष्य बना सकते हैं।',
  ],
  mr: [
    'हा खूप चांगला प्रश्न आहे! मी तुमची मदत करण्यासाठी नेहमी इथे आहे।',
    'अगदी बरोबर! तुम्ही जे विचारले ते खूप महत्त्वाचे आहे. आपण एकत्र विचार करूया.',
    'रोचक प्रश्न! ज्ञान आणि समज एकत्र वाढतात. आणखी काय जाणून घ्यायचे आहे?',
    'उत्तम! AI आणि माणूस मिळून एक चांगले भविष्य घडवू शकतात.',
  ],
};

function getMockResponse(language: string, index: number): string {
  const pool = MOCK[language] ?? MOCK['en']!;
  return pool[index % pool.length]!;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { messages, addMessage, language } = useAppContext();

  const [isTyping, setIsTyping] = useState(false);
  // Holds the text being streamed in real-time before it is committed to context
  const [streamingText, setStreamingText] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);
  const mockIndexRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom whenever messages / streaming text changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, streamingText]);

  // Cleanup on unmount
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const handleSend = useCallback(
    async (content: string, attachedFile?: string) => {
      if (isTyping) return;

      // 1. Add user message
      addMessage({ role: 'user', content, attachedFile });

      // 2. Start typing indicator
      setIsTyping(true);
      setStreamingText('');

      // Build history to send (exclude the just-added message since addMessage
      // is async via setState; we construct it directly here)
      const history = [
        ...messages,
        { role: 'user' as const, content, attachedFile },
      ].map((m) => ({ role: m.role, content: m.content }));

      // 3. Abort any prior in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      let usedStream = false;

      try {
        await streamChat({
          messages: history,
          language,
          signal: controller.signal,
          onChunk: (chunk) => {
            usedStream = true;
            setStreamingText((prev) => prev + chunk);
          },
          onDone: (full) => {
            setIsTyping(false);
            setStreamingText('');
            if (full.trim()) {
              addMessage({ role: 'assistant', content: full });
            } else if (!usedStream) {
              // Backend returned empty — use mock
              addMessage({
                role: 'assistant',
                content: getMockResponse(language, mockIndexRef.current++),
              });
            }
          },
          onError: (_err) => {
            setIsTyping(false);
            setStreamingText('');
            // Silent fallback to mock
            addMessage({
              role: 'assistant',
              content: getMockResponse(language, mockIndexRef.current++),
            });
          },
        });
      } catch {
        setIsTyping(false);
        setStreamingText('');
        addMessage({
          role: 'assistant',
          content: getMockResponse(language, mockIndexRef.current++),
        });
      }
    },
    [isTyping, messages, language, addMessage],
  );

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <ChatHeader />

      <main
        className="flex-1 overflow-y-auto px-4 pt-6 pb-2 relative z-10 scroll-smooth"
        ref={scrollRef}
      >
        <div className="max-w-3xl mx-auto flex flex-col min-h-full justify-end">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Live streaming bubble */}
          {isTyping && streamingText ? (
            <MessageBubble
              key="streaming"
              message={{
                id: 'streaming',
                role: 'assistant',
                content: streamingText,
                timestamp: new Date(),
              }}
              streaming
            />
          ) : isTyping ? (
            <TypingIndicator />
          ) : null}
        </div>
      </main>

      <InputBar onSend={handleSend} disabled={isTyping} />
    </div>
  );
}
