import Link from "next/link";

export const metadata = {
  title: "Tack! – Chart2Signals",
  description: "Din ansökan är mottagen."
};

export default function ThanksPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold">Tack för din ansökan!</h1>
      <p className="mx-auto mt-3 max-w-md text-sm opacity-80">Vi hör av oss via e-post när Pro-åtkomst är tillgänglig.</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link href="/" className="rounded-xl border px-4 py-2 text-sm hover:bg-accent">
          Till startsidan
        </Link>
        <Link href="/pricing" className="rounded-xl border px-4 py-2 text-sm hover:bg-accent">
          Priser & FAQ
        </Link>
      </div>
    </main>
  );
}
