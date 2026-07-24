// src/app/(dashboard)/projects/page.tsx
"use client";

import { useState } from "react";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { ProjectVisibility } from "@/types/project";
import Link from "next/link";

type FilterTab = "all" | ProjectVisibility;

const TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Past", value: "past" },
  { label: "Public", value: "public" },
];

const STATUS_STYLES: Record<ProjectVisibility, string> = {
  active: "bg-green-500/15 text-green-400",
  past: "bg-white/10 text-white/60",
  public: "bg-white/10 text-white/60",
};

const STATUS_LABEL: Record<ProjectVisibility, string> = {
  active: "Active",
  past: "Past · read-only",
  public: "Public",
};

export default function ProjectsPage() {
  const [tab, setTab] = useState<FilterTab>("all");

  const filtered =
    tab === "all"
      ? MOCK_PROJECTS
      : MOCK_PROJECTS.filter((p) => p.visibility === tab);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-lg font-medium">Your projects</h1>
      </div>
      <p className="text-sm text-white/60 mb-5">
        {MOCK_PROJECTS.filter((p) => p.visibility === "active").length} active,{" "}
        {MOCK_PROJECTS.filter((p) => p.visibility === "past").length} from
        history, {MOCK_PROJECTS.filter((p) => p.visibility === "public").length}{" "}
        public to your team
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
        {filtered.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:border-white/25 transition-colors"
          >
            <div className="flex justify-between items-start">
              <p className="font-medium text-sm">{project.name}</p>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-md whitespace-nowrap ${STATUS_STYLES[project.visibility]}`}
              >
                {STATUS_LABEL[project.visibility]}
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1.5">{project.team}</p>
            <p className="text-xs text-white/40 mt-3">
              Updated {project.updatedAt}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-5 border border-dashed border-white/20 rounded-xl p-4 text-center">
        <p className="text-[13px] text-white/40">
          Some projects in your company aren&apos;t shown here because
          they&apos;re restricted.
        </p>
      </div>
    </div>
  );
}
