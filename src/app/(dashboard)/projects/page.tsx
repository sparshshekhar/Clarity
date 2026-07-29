// src/app/(dashboard)/projects/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";

type FilterTab = "all" | "active" | "alumni" | "public_only";

const TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Past", value: "alumni" },
  { label: "Public", value: "public_only" },
];

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-500/15 text-green-400",
  alumni: "bg-white/10 text-white/60",
  owner: "bg-green-500/15 text-green-400",
  none: "bg-white/10 text-white/60",
};

function getBadge(project: any) {
  if (project.access_reason === "active" || project.access_reason === "owner") {
    return { label: "Active", key: "active" };
  }
  if (project.access_reason === "alumni") {
    return { label: "Past · read-only", key: "alumni" };
  }
  return { label: "Public", key: "none" };
}

export default function ProjectsPage() {
  const [tab, setTab] = useState<FilterTab>("all");
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getProjects()
      .then(setProjects)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Failed to load projects",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    tab === "all"
      ? projects
      : projects.filter((p) => {
          if (tab === "public_only") return !p.access_reason;
          return (
            p.access_reason === tab ||
            (tab === "active" && p.access_reason === "owner")
          );
        });

  const activeCount = projects.filter(
    (p) => p.access_reason === "active" || p.access_reason === "owner",
  ).length;
  const alumniCount = projects.filter(
    (p) => p.access_reason === "alumni",
  ).length;
  const publicCount = projects.filter((p) => !p.access_reason).length;

  if (loading)
    return <p className="text-sm text-white/60">Loading projects...</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-lg font-medium mb-1">Your projects</h1>
      <p className="text-sm text-white/60 mb-5">
        {activeCount} active, {alumniCount} from history, {publicCount} public
        to your team
      </p>

      <div className="flex gap-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`text-[13px] px-3.5 py-1.5 rounded-md ${
              tab === t.value
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filtered.map((project) => {
          const badge = getBadge(project);
          return (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:border-white/25 transition-colors"
            >
              <div className="flex justify-between items-start">
                <p className="font-medium text-sm">{project.name}</p>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-md whitespace-nowrap ${STATUS_STYLES[badge.key]}`}
                >
                  {badge.label}
                </span>
              </div>
              <p className="text-xs text-white/60 mt-1.5">{project.team}</p>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <p className="text-sm text-white/40 mt-4">
          No projects in this view yet.
        </p>
      )}

      <div className="mt-5 border border-dashed border-white/20 rounded-xl p-4 text-center">
        <p className="text-[13px] text-white/40">
          Some projects in your company aren&apos;t shown here because
          they&apos;re restricted.
        </p>
      </div>
    </div>
  );
}
