// src/app/(dashboard)/chat/page.tsx
"use client";

import { useState } from "react";
import { MOCK_CONVERSATIONS, MOCK_THREAD } from "@/lib/mock-chat";
import { Sparkles, Send } from "lucide-react";
import { ChatMessage } from "@/types/chat";

export default function ChatPage() {
  const [activeId, setActiveId] = useState(MOCK_CONVERSATIONS[0].id);
  const [threads, setThreads] = useState(MOCK_THREAD);
  const [input, setInput] = useState("");

  const active = MOCK_CONVERSATIONS.find((c) => c.id === activeId)!;
  const thread = threads[activeId] ?? [];

  function handleSend() {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: crypto.randomUUID(),
      from: "me",
      text: input,
      time: "Just now",
    };
    setThreads((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), newMsg],
    }));
    setInput("");
  }

  return (
    <div className="flex h-[calc(100vh-48px)] -m-6">
      {/* ... conversation list stays the same ... */}

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/10">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-medium">
            {active.personInitials}
          </div>
          <p className="text-sm font-medium">{active.personName}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {thread.map((m) => (
            <div
              key={m.id}
              className={`max-w-[60%] ${m.from === "me" ? "self-end" : "self-start"}`}
            >
              {m.from === "clarity" && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Sparkles size={12} className="text-indigo-400" />
                  <span className="text-[11px] text-indigo-400">Clarity</span>
                </div>
              )}
              <div
                className={`text-[13px] px-3.5 py-2.5 rounded-lg ${
                  m.from === "clarity"
                    ? "bg-indigo-500/15 border border-indigo-500/30"
                    : m.from === "me"
                      ? "bg-indigo-500/20"
                      : "bg-white/5"
                }`}
              >
                {m.text}
              </div>
              <p className="text-[11px] text-white/30 mt-1">{m.time}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`Message ${active.personName}...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-[13px] outline-none focus:border-white/30"
          />
          <button
            onClick={handleSend}
            className="bg-indigo-500 hover:bg-indigo-600 rounded-md p-2"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
