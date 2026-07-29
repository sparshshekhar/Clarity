// src/app/(dashboard)/projects/[projectId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api-client";
import { FileText, Code2, ScrollText, Plus, RefreshCw } from "lucide-react";
import { MOCK_LOGS } from "@/lib/mock-project-detail";
import UploadDocModal from "@/components/projects/UploadDocModal";

type Tab = "docs" | "code" | "logs";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [tab, setTab] = useState<Tab>("docs");
  const [project, setProject] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [codeFiles, setCodeFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [syncing, setSyncing] = useState(false);

  function loadData() {
    Promise.all([
      api.getProject(projectId),
      api.getDocuments(projectId),
      api.getCodeFiles(projectId),
    ])
      .then(([projectData, docsData, codeData]) => {
        setProject(projectData);
        setDocs(docsData);
        setCodeFiles(codeData);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load project"),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, [projectId]);

  async function handleSync() {
    setSyncing(true);
    try {
      await api.syncGithub(projectId);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  if (loading)
    return <p className="text-sm text-white/60">Loading project...</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!project)
    return <p className="text-sm text-white/60">Project not found.</p>;

  return (
    <div>
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-lg font-medium">{project.name}</h1>
          <p className="text-sm text-white/60 mt-1">{project.team}</p>
        </div>
        {tab === "docs" && (
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-1.5 text-[13px] bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-md"
          >
            <Plus size={14} />
            Add document
          </button>
        )}
        {tab === "code" && (
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 text-[13px] bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 px-3 py-1.5 rounded-md"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing..." : "Sync from GitHub"}
          </button>
        )}
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
          {docs.length === 0 && (
            <p className="text-sm text-white/40">
              No documents indexed for this project yet.
            </p>
          )}
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-4"
            >
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium">{doc.doc_name}</p>
                <span className="text-[11px] text-white/40 shrink-0">
                  {new Date(doc.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "code" && (
        <div className="flex flex-col gap-2.5">
          {codeFiles.length === 0 && (
            <p className="text-sm text-white/40">
              No code synced yet. Click &quot;Sync from GitHub&quot; to index
              this project&apos;s repository.
            </p>
          )}
          {codeFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-4"
            >
              <p className="text-sm font-mono">{file.path}</p>
              {file.last_commit_message && (
                <p className="text-[13px] text-white/60 mt-1.5">
                  {file.last_commit_message}
                </p>
              )}
              <p className="text-[11px] text-white/40 mt-1">
                Synced {new Date(file.last_synced_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "logs" && (
        <div className="flex flex-col gap-2">
          {MOCK_LOGS.map((log) => (
            <div
              key={log.id}
              className="px-3.5 py-2.5 rounded-md bg-white/[0.03] border border-white/10"
            >
              <p className="text-[13px] font-mono">{log.message}</p>
              <p className="text-[11px] text-white/40 mt-0.5">{log.time}</p>
            </div>
          ))}
        </div>
      )}

      {showUpload && (
        <UploadDocModal
          projectId={projectId}
          onClose={() => setShowUpload(false)}
          onSuccess={loadData}
        />
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
