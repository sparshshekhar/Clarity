// src/app/(dashboard)/alerts/page.tsx
"use client";

import { MOCK_ALERTS } from "@/lib/mock-alerts";
import { AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";

export default function AlertsPage() {
  return (
    <div>
      <h1 className="text-lg font-medium mb-1">Alerts</h1>
      <p className="text-sm text-white/60 mb-5">
        Clarity watches your deploys and logs, and flags issues here the moment
        they happen.
      </p>

      <div className="flex flex-col gap-3">
        {MOCK_ALERTS.map((alert) => (
          <div
            key={alert.id}
            className={`rounded-xl border p-4 ${
              alert.resolved
                ? "border-white/10 opacity-60"
                : alert.severity === "critical"
                  ? "border-red-500/30 bg-red-500/5"
                  : "border-yellow-500/30 bg-yellow-500/5"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                {alert.resolved ? (
                  <CheckCircle2 size={18} className="text-green-400 mt-0.5" />
                ) : (
                  <AlertTriangle
                    size={18}
                    className={`mt-0.5 ${
                      alert.severity === "critical"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-xs text-white/50 mt-0.5">
                    {alert.project} · {alert.time}
                  </p>
                </div>
              </div>
              {alert.resolved && (
                <span className="text-[11px] text-white/40 shrink-0">
                  Resolved
                </span>
              )}
            </div>

            <div className="mt-3 pl-[26px] flex flex-col gap-2">
              <div className="flex items-start gap-1.5">
                <Sparkles
                  size={12}
                  className="text-indigo-400 mt-0.5 shrink-0"
                />
                <p className="text-[13px] text-white/70">{alert.summary}</p>
              </div>
              <div className="bg-white/5 rounded-md px-3 py-2">
                <p className="text-[11px] text-white/40 mb-1">Suggested fix</p>
                <p className="text-[13px]">{alert.suggestedFix}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
