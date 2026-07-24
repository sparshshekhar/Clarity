// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // placeholder — wire this to your real auth endpoint once the backend exists
    router.push("/home");
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center mb-3">
          <Sparkles size={22} className="text-indigo-400" />
        </div>
        <p className="text-lg font-medium">Clarity</p>
        <p className="text-sm text-white/50 mt-1">
          Sign in with your company account
        </p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-white/50 mb-1.5 block">
            Work email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-sm outline-none focus:border-indigo-400/60"
          />
        </div>

        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2.5 text-sm outline-none focus:border-indigo-400/60"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-md py-2.5 text-sm font-medium mt-2"
        >
          Sign in
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/40">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <button className="w-full border border-white/10 hover:bg-white/5 rounded-md py-2.5 text-sm flex items-center justify-center gap-2">
        Continue with Google Workspace
      </button>

      <p className="text-xs text-white/40 text-center mt-6">
        Access is scoped to your company domain and existing project
        permissions.
      </p>
    </div>
  );
}
