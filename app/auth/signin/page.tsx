"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function requestLink(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    await fetch("/api/auth/signin/email", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ callbackUrl: "/", email })
    });
    window.location.href = "/auth/dev";
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold">Logga in</h1>
      <p className="mt-2 text-sm opacity-80">Skriv din e-postadress så får du en magisk länk (dev-läge).</p>
      <form onSubmit={requestLink} className="mt-6 space-y-3">
        <input
          type="email"
          required
          placeholder="namn@exempel.se"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border bg-background px-3 py-2"
        />
        <button
          className="w-full rounded-xl border px-3 py-2 text-sm hover:bg-accent disabled:opacity-60"
          disabled={pending}
        >
          {pending ? "Skickar …" : "Skicka länk"}
        </button>
      </form>
      <p className="mt-4 text-xs opacity-70">
        Redan begärt länk? Öppna {" "}
        <Link href="/auth/dev" className="underline">
          /auth/dev
        </Link>
        .
      </p>
    </main>
  );
}
