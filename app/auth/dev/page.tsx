import { redirect } from "next/navigation";
import { getLastMagicLink } from "@/lib/dev/lastLink";
import { mockAuthDB, getOrCreateUser } from "@/lib/db/mockAuth";

export const dynamic = "force-dynamic";

export default async function DevAuthPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams?.token;
  if (token) {
    const rec = mockAuthDB.verificationTokens.get(token);
    if (!rec) {
      return (
        <main className="mx-auto max-w-lg px-4 py-16">
          <h1 className="text-2xl font-semibold">Ogiltig eller förbrukad länk</h1>
          <p className="mt-2 text-sm opacity-80">Begär en ny magisk länk via /auth/signin.</p>
        </main>
      );
    }
    if (Date.now() > rec.expires) {
      mockAuthDB.verificationTokens.delete(token);
      return (
        <main className="mx-auto max-w-lg px-4 py-16">
          <h1 className="text-2xl font-semibold">Länken har gått ut</h1>
          <p className="mt-2 text-sm opacity-80">Begär en ny magisk länk via /auth/signin.</p>
        </main>
      );
    }
    getOrCreateUser(rec.identifier);
    mockAuthDB.verificationTokens.delete(token);
    redirect("/");
  }
  const last = getLastMagicLink();
  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-2xl font-semibold">Dev Magic Link</h1>
      {!last ? (
        <p className="mt-2 text-sm opacity-80">
          Ingen länk ännu. Gå till <a className="underline" href="/auth/signin">/auth/signin</a> och begär en länk.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm opacity-80">Klicka för att logga in:</p>
          <a className="mt-3 inline-block rounded-xl border px-4 py-2 text-sm hover:bg-accent" href={last}>
            Öppna magisk länk
          </a>
          <p className="mt-3 text-xs opacity-70">Länken skrevs också ut i server-konsolen.</p>
        </>
      )}
    </main>
  );
}
