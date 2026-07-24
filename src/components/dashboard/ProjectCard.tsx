// src/components/dashboard/ProjectCard.tsx
import Link from "next/link";

type Status = "active" | "alert" | "past" | "public";

const STATUS_STYLES: Record<Status, string> = {
  active: "bg-green-500/15 text-green-400",
  alert: "bg-red-500/15 text-red-400",
  past: "bg-white/10 text-white/60",
  public: "bg-white/10 text-white/60",
};

const STATUS_LABEL: Record<Status, string> = {
  active: "Active",
  alert: "Alert",
  past: "Past",
  public: "Public",
};

export default function ProjectCard({
  id,
  name,
  team,
  status,
}: {
  id: string;
  name: string;
  team: string;
  status: Status;
}) {
  return (
    <Link
      href={`/projects/${id}`}
      className="block bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:border-white/25 transition-colors"
    >
      <div className="flex justify-between items-start">
        <p className="font-medium text-sm">{name}</p>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-md ${STATUS_STYLES[status]}`}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>
      <p className="text-xs text-white/60 mt-1.5">{team}</p>
    </Link>
  );
}
