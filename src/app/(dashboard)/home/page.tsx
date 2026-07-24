// src/app/(dashboard)/home/page.tsx
import StatCard from "@/components/dashboard/StatCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import ProjectCard from "@/components/dashboard/ProjectCard";

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

export default function HomePage() {
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
        <StatCard label="Active projects" value={4} />
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
      <div className="grid grid-cols-3 gap-3">
        <ProjectCard
          id="1"
          name="Checkout revamp"
          team="Payments team"
          status="alert"
        />
        <ProjectCard
          id="2"
          name="Onboarding flow v2"
          team="Growth team"
          status="active"
        />
        <ProjectCard
          id="3"
          name="Notification service"
          team="Platform team"
          status="past"
        />
      </div>
    </div>
  );
}
