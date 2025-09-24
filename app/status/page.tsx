import Link from "next/link";

async function loadData() {
  const token = process.env.STATUS_TOKEN || "";
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/status?limit=20`;
  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store"
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("status fetch failed", error);
    return null;
  }
}

export const metadata = {
  title: "Webhook Status – Chart2Signals",
  description: "Senaste webhook-händelser (dev)."
};

export default async function StatusPage() {
  const data = await loadData();
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Webhook Status (dev)</h1>
        <Link href="/" className="text-sm opacity-80 hover:opacity-100">
          Start
        </Link>
      </header>

      {!data?.ok ? (
        <p className="text-sm opacity-80">
          Kunde inte hämta status. Kontrollera STATUS_TOKEN och NEXT_PUBLIC_SITE_URL.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="border-b py-2 pr-3">Mottagen</th>
                <th className="border-b py-2 pr-3">Typ</th>
                <th className="border-b py-2 pr-3">ID</th>
                <th className="border-b py-2 pr-3">Handled</th>
                <th className="border-b py-2 pr-3">Note</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((it: any) => (
                <tr key={it.id}>
                  <td className="border-b py-2 pr-3">{new Date(it.receivedAt).toLocaleString("sv-SE")}</td>
                  <td className="border-b py-2 pr-3">{it.type}</td>
                  <td className="border-b py-2 pr-3">{it.id}</td>
                  <td className="border-b py-2 pr-3">{it.handled ? "Ja" : "Nej"}</td>
                  <td className="border-b py-2 pr-3">{it.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs opacity-70">Tips: sätt NEXT_PUBLIC_SITE_URL i .env.local.</p>
    </main>
  );
}
