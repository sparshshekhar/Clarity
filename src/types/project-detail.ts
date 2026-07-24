// src/types/project-detail.ts
export type DocFile = {
  id: string;
  name: string;
  excerpt: string;
  updatedAt: string;
};

export type CodeFile = {
  id: string;
  path: string;
  lastCommit: string;
  commitTime: string;
};

export type LogEntry = {
  id: string;
  level: "info" | "warning" | "error";
  message: string;
  time: string;
};
