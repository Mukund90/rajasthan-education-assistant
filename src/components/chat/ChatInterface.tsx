import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage, QUICK_QUESTIONS } from "@/lib/types";
import { streamChat, logQuery } from "@/lib/chat-service";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypingIndicator } from "./TypingIndicator";
import { ChatBubble } from "./ChatBubble";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    logQuery(text.trim());

    let assistantSoFar = "";
    const assistantId = crypto.randomUUID();

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.id === assistantId) {
          return prev.map((m) =>
            m.id === assistantId ? { ...m, content: assistantSoFar } : m
          );
        }
        return [
          ...prev,
          { id: assistantId, role: "assistant", content: assistantSoFar, timestamp: new Date() },
        ];
      });
    };

    const apiMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    await streamChat({
      messages: apiMessages,
      onDelta: upsertAssistant,
      onDone: () => setIsLoading(false),
      onError: (error) => {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `I'm sorry, I encountered an issue: ${error}`,
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1">
        {messages.length === 0 ? (
          <WelcomeScreen onQuestionClick={sendMessage} />
        ) : (
          messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)
        )}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <TypingIndicator />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border bg-card p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about admissions, colleges, scholarships..."
            className="flex-1 resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[48px] max-h-[120px]"
            rows={1}
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-12 w-12 shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          DTE Rajasthan AI Assistant • Responses may not always be accurate — please verify from official sources
        </p>
      </div>
    </div>
  );
}

function WelcomeScreen({ onQuestionClick }: { onQuestionClick: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center px-4">
      <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6">
        <Bot className="h-8 w-8 text-primary-foreground" />
      </div>
      <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
        DTE Rajasthan Assistant
      </h2>
      <p className="text-muted-foreground mb-8">
        Your AI guide for engineering & polytechnic education in Rajasthan. Ask me anything about admissions, colleges, fees, scholarships, and more!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {QUICK_QUESTIONS.slice(0, 6).map((q) => (
          <button
            key={q}
            onClick={() => onQuestionClick(q)}
            className="text-left p-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-sm text-foreground flex items-start gap-2"
          >
            <Sparkles className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <span>{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
