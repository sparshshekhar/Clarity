// src/components/projects/UploadDocModal.tsx
"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { api } from "@/lib/api-client";

export default function UploadDocModal({
  projectId,
  onClose,
  onSuccess,
}: {
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [docName, setDocName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!docName.trim() || !text.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await api.ingestDocument(projectId, docName, text);
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload document",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium flex items-center gap-2">
            <Upload size={15} className="text-indigo-400" />
            Add a document
          </p>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">
              Document name
            </label>
            <input
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. requirements.md"
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-indigo-400/60"
            />
          </div>

          <div>
            <label className="text-xs text-white/50 mb-1.5 block">
              Content
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the document text here..."
              rows={8}
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-indigo-400/60 resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-3.5 py-2 rounded-md text-white/60 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="text-sm px-3.5 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
            >
              {loading ? "Indexing..." : "Upload & index"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
