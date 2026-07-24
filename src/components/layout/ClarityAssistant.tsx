// src/components/layout/ClarityAssistant.tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Send } from "lucide-react";

type Message = { id: string; from: "user" | "clarity"; text: string };

export default function ClarityAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      from: "clarity",
      text: "Hey! Ask me anything about your projects, code, or errors.",
    },
  ]);

  // Hide the floating widget on the Chat page — it already has its own input
  if (pathname === "/chat") return null;

  function handleSend() {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), from: "user", text: input },
    ]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          from: "clarity",
          text: "Got it — once the backend is wired up, I'll answer this from your project's docs and code.",
        },
      ]);
    }, 500);
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 w-[340px] h-[440px] bg-[#111] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-400" />
              <span className="text-sm font-medium">Ask Clarity</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/50 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`text-[13px] px-3 py-2 rounded-lg max-w-[85%] ${
                  m.from === "user"
                    ? "bg-indigo-500/20 self-end text-right"
                    : "bg-white/5 self-start"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-3 border-t border-white/10">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-[13px] outline-none focus:border-white/30"
            />
            <button
              onClick={handleSend}
              className="bg-indigo-500 hover:bg-indigo-600 rounded-md p-1.5"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center shadow-lg z-50"
      >
        <Sparkles size={22} className="text-white" />
      </button>
    </>
  );
}
