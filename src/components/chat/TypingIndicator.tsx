import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 py-3 animate-fade-in-up">
      <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
        <Bot className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="bg-chat-bot rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
        <div className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
      </div>
    </div>
  );
}
