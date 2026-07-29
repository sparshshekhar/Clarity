// src/app/(dashboard)/home/page.tsx
"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/dashboard/StatCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ProjectCard from "@/components/dashboard/ProjectCard";
import { api } from "@/lib/api-client";

const activity = [
  {
    id: "1",
    type: "alert" as const,
    text: "Checkout revamp: deploy failed, null pointer in payment handler",
    time: "12 minutes ago · Clarity flagged this",
  },
  {
    id: "2",
    type: "commit" as const,
    text: "Onboarding flow v2: 4 new commits indexed",
    time: "1 hour ago",
  },
  {
    id: "3",
    type: "question" as const,
    text: "Arjun asked Clarity about the auth flow in Notification service",
    time: "3 hours ago",
  },
];

function getBadgeStatus(project: any): "active" | "alert" | "past" | "public" {
  if (project.access_reason === "active" || project.access_reason === "owner")
    return "active";
  if (project.access_reason === "alumni") return "past";
  return "public";
}

export default function HomePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const activeCount = projects.filter(
    (p) => p.access_reason === "active" || p.access_reason === "owner",
  ).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-lg font-medium">Good morning, Sparsh</h1>
          <p className="text-sm text-white/60 mt-1">
            Clarity&apos;s been keeping watch overnight — here&apos;s what
            changed.
          </p>
        </div>
        <input
          type="text"
          placeholder="Ask Clarity anything"
          className="w-56 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-white/30"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Active projects" value={activeCount} />
        <StatCard label="Open alerts" value={2} danger />
        <StatCard label="Questions this week" value={17} />
      </div>

      <p className="text-sm font-medium mb-2.5">Recent activity</p>
      <div className="mb-6">
        <ActivityFeed items={activity} />
      </div>

      <div className="flex justify-between items-center mb-2.5">
        <p className="text-sm font-medium">Your projects</p>
        <span className="text-sm text-indigo-400 cursor-pointer">View all</span>
      </div>

      {loading ? (
        <p className="text-sm text-white/40">Loading projects...</p>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              team={project.team}
              status={getBadgeStatus(project)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
