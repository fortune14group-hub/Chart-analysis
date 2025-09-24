"use client";

import { useEffect, useState } from "react";

export default function AuthButtons() {
  const [session, setSession] = useState<any>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/session");
        setSession(res.ok ? await res.json() : null);
      } catch (error) {
        console.error("session fetch error", error);
        setSession(null);
      }
    })();
  }, []);
  const isPro = !!session?.user?.isPro;
  return (
    <div className="flex items-center gap-2">
      {isPro && (
        <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-500">PRO</span>
      )}
      {session?.user ? (
        <>
          <span className="text-xs opacity-80">{session.user.email}</span>
          <a className="rounded-xl border px-3 py-1 text-sm hover:bg-accent" href="/api/auth/signout">
            Logga ut
          </a>
        </>
      ) : (
        <a className="rounded-xl border px-3 py-1 text-sm hover:bg-accent" href="/auth/signin">
          Logga in
        </a>
      )}
    </div>
  );
}
