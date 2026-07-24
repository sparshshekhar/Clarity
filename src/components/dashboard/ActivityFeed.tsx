// src/components/dashboard/ActivityFeed.tsx
import { AlertTriangle, GitCommit, MessageCircle } from "lucide-react";

type Activity = {
  id: string;
  type: "alert" | "commit" | "question";
  text: string;
  time: string;
};

const ICONS = {
  alert: AlertTriangle,
  commit: GitCommit,
  question: MessageCircle,
};

export default function ActivityFeed({ items }: { items: Activity[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const Icon = ICONS[item.type];
        const isAlert = item.type === "alert";
        return (
          <div
            key={item.id}
            className={`flex items-start gap-2.5 px-3 py-2.5 rounded-md border ${
              isAlert ? "border-red-500/30 bg-red-500/10" : "border-white/10"
            }`}
          >
            <Icon
              size={16}
              className={`mt-0.5 ${isAlert ? "text-red-400" : "text-white/60"}`}
            />
            <div>
              <p className={`text-[13px] ${isAlert ? "text-red-400" : ""}`}>
                {item.text}
              </p>
              <p className="text-xs text-white/40 mt-0.5">{item.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
