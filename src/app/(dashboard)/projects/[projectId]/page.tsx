// src/app/(dashboard)/projects/[projectId]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import {
  MOCK_DOCS,
  MOCK_CODE_FILES,
  MOCK_LOGS,
} from "@/lib/mock-project-detail";
import {
  FileText,
  Code2,
  ScrollText,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";

type Tab = "docs" | "code" | "logs";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [tab, setTab] = useState<Tab>("docs");

  const project = MOCK_PROJECTS.find((p) => p.id === projectId);

  if (!project) {
    return <p className="text-sm text-white/60">Project not found.</p>;
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-medium">{project.name}</h1>
        <p className="text-sm text-white/60 mt-1">{project.team}</p>
      </div>

      <div className="flex gap-2 mb-5 border-b border-white/10">
        <TabButton
          active={tab === "docs"}
          onClick={() => setTab("docs")}
          icon={FileText}
          label="Docs"
        />
        <TabButton
          active={tab === "code"}
          onClick={() => setTab("code")}
          icon={Code2}
          label="Code"
        />
        <TabButton
          active={tab === "logs"}
          onClick={() => setTab("logs")}
          icon={ScrollText}
          label="Logs"
        />
      </div>

      {tab === "docs" && (
        <div className="flex flex-col gap-2.5">
          {MOCK_DOCS.map((doc) => (
            <div
              key={doc.id}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-4"
            >
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium">{doc.name}</p>
                <span className="text-[11px] text-white/40 shrink-0">
                  {doc.updatedAt}
                </span>
              </div>
              <p className="text-[13px] text-white/60 mt-1.5">{doc.excerpt}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "code" && (
        <div className="flex flex-col gap-2.5">
          {MOCK_CODE_FILES.map((file) => (
            <div
              key={file.id}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-4"
            >
              <p className="text-sm font-mono">{file.path}</p>
              <p className="text-[13px] text-white/60 mt-1.5">
                {file.lastCommit}
              </p>
              <p className="text-[11px] text-white/40 mt-1">
                {file.commitTime}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "logs" && (
        <div className="flex flex-col gap-2">
          {MOCK_LOGS.map((log) => {
            const Icon =
              log.level === "error"
                ? AlertCircle
                : log.level === "warning"
                  ? AlertTriangle
                  : Info;
            const color =
              log.level === "error"
                ? "text-red-400"
                : log.level === "warning"
                  ? "text-yellow-400"
                  : "text-white/50";
            return (
              <div
                key={log.id}
                className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-md bg-white/[0.03] border border-white/10"
              >
                <Icon size={15} className={`mt-0.5 shrink-0 ${color}`} />
                <div>
                  <p className={`text-[13px] font-mono ${color}`}>
                    {log.message}
                  </p>
                  <p className="text-[11px] text-white/40 mt-0.5">{log.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2.5 text-sm border-b-2 -mb-px ${
        active
          ? "border-indigo-400 text-white"
          : "border-transparent text-white/50 hover:text-white/80"
      }`}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}
