import { ChatMessage } from "@/lib/types";
import { Bot, User, Volume2, VolumeX } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function ChatBubble({ message, autoSpeak }: { message: ChatMessage; autoSpeak?: boolean }) {
  const isUser = message.role === "user";
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      alert("Voice playback is not supported in this browser.");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    // Strip markdown for cleaner speech
    const plainText = message.content
      .replace(/```[\s\S]*?```/g, "")
      .replace(/[#*_~`>\[\]()!]/g, "")
      .replace(/\n+/g, ". ")
      .trim();
    if (!plainText) return;

    const isHindi = /[\u0900-\u097F]/.test(plainText);
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = isHindi ? "hi-IN" : "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Pick the best matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => v.lang === utterance.lang) ||
      voices.find((v) => v.lang.startsWith(isHindi ? "hi" : "en"));
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [message.content, isSpeaking]);

  // Ensure voices list is loaded (some browsers load asynchronously)
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const handler = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = handler;
    handler();
  }, []);

  return (
    <div className={`flex gap-3 animate-fade-in-up py-3 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 mt-1">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-br-md"
            : "bg-chat-bot text-chat-bot-foreground rounded-bl-md"
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none text-chat-bot-foreground prose-headings:text-chat-bot-foreground prose-strong:text-chat-bot-foreground prose-a:text-primary">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        {!isUser && message.content && (
          <div className="flex justify-end mt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={speak}
              className="h-7 w-7 p-0 opacity-60 hover:opacity-100"
              title={isSpeaking ? "Stop speaking" : "Listen to response"}
            >
              {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </Button>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0 mt-1">
          <User className="h-4 w-4 text-accent-foreground" />
        </div>
      )}
    </div>
  );
}
