"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage } from "@/types";
import type { WorldData } from "@/lib/ai";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Navigator online. I'm Echo, your guide to the EVE Frontier. Ask me about solar systems, smart assemblies, or strategic intel. Try: \"Show me the solar systems\" to load the star map.",
  timestamp: Date.now(),
};

const SUGGESTIONS = [
  "Show me all solar systems",
  "What smart assemblies exist?",
  "Explain the game mechanics",
  "What's the safest region?",
];

interface ChatPanelProps {
  onWorldData?: (data: WorldData) => void;
}

const ChatPanel = ({ onWorldData }: ChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-fetch solar systems on mount for initial star map
  useEffect(() => {
    fetch("/api/world?path=systems")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && Array.isArray(data) && onWorldData) {
          onWorldData({ systems: data });
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages.filter((m) => m.id !== "welcome"), userMsg].map(
            ({ role, content }) => ({ role, content })
          ),
        }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
      if (data.worldData && onWorldData) {
        onWorldData(data.worldData);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Signal lost. Check your connection and try again.",
          timestamp: Date.now(),
        },
      ]);
    }

    setLoading(false);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800/50 bg-zinc-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-sm font-semibold text-cyan-400 tracking-wide uppercase">
              Echo Navigator
            </h2>
          </div>
          <a
            href="/about"
            className="text-[10px] text-zinc-600 hover:text-cyan-400 font-mono tracking-wider uppercase transition-colors"
          >
            About
          </a>
        </div>
        <p className="text-[11px] text-zinc-500 mt-1 ml-5">
          EVE Frontier AI Assistant — Powered by Claude
        </p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm leading-relaxed rounded-xl p-3.5 ${
                msg.role === "user"
                  ? "text-zinc-200 bg-zinc-800/60 ml-8"
                  : "text-zinc-300 bg-cyan-950/20 border border-cyan-900/30 mr-4"
              }`}
            >
              <span
                className={`text-[10px] uppercase tracking-wider block mb-1.5 ${
                  msg.role === "user" ? "text-zinc-500" : "text-cyan-500/70"
                }`}
              >
                {msg.role === "user" ? "You" : "Echo"}
              </span>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-cyan-400/60 p-3"
          >
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            Scanning frequencies...
          </motion.div>
        )}

        {/* Suggestions */}
        {showSuggestions && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-2 mt-4"
          >
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-[11px] text-left text-zinc-400 bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800/50 hover:border-cyan-800/40 rounded-lg px-3 py-2.5 transition-all hover:text-cyan-300"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-zinc-800/50 bg-zinc-950">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask Echo about the frontier..."
            className="flex-1 bg-zinc-900/60 border border-zinc-800/50 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-700/50 transition-colors"
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl text-sm font-medium transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
