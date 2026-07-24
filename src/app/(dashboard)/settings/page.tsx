// src/app/(dashboard)/settings/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_INTEGRATIONS } from "@/lib/mock-settings";
import { Check, Plug } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [inAppAlerts, setInAppAlerts] = useState(true);

  function handleLogout() {
    // placeholder — once real auth exists, clear the session/token here too
    router.push("/login");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-lg font-medium mb-1">Settings</h1>
      <p className="text-sm text-white/60 mb-6">
        Manage your profile, notifications, and connected tools.
      </p>

      <section className="mb-8">
        <p className="text-sm font-medium mb-3">Profile</p>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm font-medium">
            SP
          </div>
          <div>
            <p className="text-sm font-medium">Sparsh</p>
            <p className="text-xs text-white/50 mt-0.5">sparsh@company.com</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <p className="text-sm font-medium mb-3">Notifications</p>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl divide-y divide-white/10">
          <ToggleRow
            label="Email alerts"
            description="Get an email when Clarity flags a production issue on your projects."
            checked={emailAlerts}
            onChange={setEmailAlerts}
          />
          <ToggleRow
            label="Critical alerts only"
            description="Only notify me for critical severity, not warnings."
            checked={criticalOnly}
            onChange={setCriticalOnly}
          />
          <ToggleRow
            label="In-app notifications"
            description="Show a badge and toast when a new alert comes in."
            checked={inAppAlerts}
            onChange={setInAppAlerts}
          />
        </div>
      </section>

      <section className="mb-8">
        <p className="text-sm font-medium mb-3">Connected tools</p>
        <div className="flex flex-col gap-2.5">
          {MOCK_INTEGRATIONS.map((integration) => (
            <div
              key={integration.id}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Plug size={16} className="text-white/60" />
                </div>
                <div>
                  <p className="text-sm font-medium">{integration.name}</p>
                  <p className="text-xs text-white/50 mt-0.5 max-w-md">
                    {integration.description}
                  </p>
                </div>
              </div>
              {integration.status === "connected" ? (
                <span className="flex items-center gap-1 text-[12px] text-green-400 shrink-0">
                  <Check size={13} /> Connected
                </span>
              ) : (
                <button className="text-[12px] bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-md shrink-0">
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="text-sm font-medium mb-3">Account</p>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-medium">Log out</p>
            <p className="text-xs text-white/50 mt-0.5">
              You&apos;ll need to sign back in to access your projects.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[12px] bg-red-500/15 text-red-400 hover:bg-red-500/25 px-3 py-1.5 rounded-md shrink-0"
          >
            Log out
          </button>
        </div>
      </section>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="pr-4">
        <p className="text-[13px] font-medium">{label}</p>
        <p className="text-xs text-white/50 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full shrink-0 relative transition-colors ${
          checked ? "bg-indigo-500" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-[16px]" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
