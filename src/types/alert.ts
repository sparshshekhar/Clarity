// src/types/alert.ts
export type AlertSeverity = "critical" | "warning";

export type ProjectAlert = {
  id: string;
  project: string;
  title: string;
  time: string;
  severity: AlertSeverity;
  summary: string;
  suggestedFix: string;
  resolved?: boolean;
};
