// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Folder,
  MessageCircle,
  Bell,
  Settings,
  Sparkles,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Projects", href: "/projects", icon: Folder },
  { label: "Chat", href: "/chat", icon: MessageCircle },
  { label: "Alerts", href: "/alerts", icon: Bell, badge: 2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[180px] shrink-0 border-r border-white/10 px-2 py-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 px-2 pb-5">
        <Sparkles size={20} className="text-indigo-400" />
        <span className="font-semibold text-[16px]">Clarity</span>
      </div>

      {NAV_ITEMS.map(({ label, href, icon: Icon, badge }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm ${
              active
                ? "bg-white/10 font-medium"
                : "text-white/60 hover:bg-white/5"
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
            {badge ? (
              <span className="ml-auto bg-red-500/20 text-red-400 text-[11px] px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </aside>
  );
}
