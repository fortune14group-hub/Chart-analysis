import Link from "next/link";
import { submitProSignup } from "@/lib/actions/signup";
import { features } from "@/lib/utils/features";

export const metadata = {
  title: "Bli Pro – Chart2Signals",
  description: "Ansök om Pro-åtkomst till Chart2Signals by BetSpread."
};

export default function SignupPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Bli Pro</h1>
        <p className="mt-2 text-sm opacity-80">Fyll i dina uppgifter så kontaktar vi dig om Pro-åtkomst.</p>
      </header>

      {!features.proEnabled && (
        <div className="mb-6 rounded-2xl border bg-card/50 p-4 text-sm">
          <p className="opacity-90">
            <strong>Pro är för närvarande stängt</strong> för nya användare. Lämna din e-post så hör vi av oss.
          </p>
        </div>
      )}

      <form
        action={async (formData: FormData) => {
          "use server";
          await submitProSignup({
            name: String(formData.get("name") || ""),
            email: String(formData.get("email") || ""),
            company: String(formData.get("company") || ""),
            note: String(formData.get("note") || ""),
            website: String(formData.get("website") || "")
          });
        }}
        className="space-y-4 rounded-2xl border p-6"
      >
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
        <div>
          <label className="mb-1 block text-sm font-medium">Namn</label>
          <input
            name="name"
            required
            minLength={2}
            placeholder="För- och efternamn"
            className="w-full rounded-xl border bg-background px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">E-post</label>
          <input
            name="email"
            type="email"
            required
            placeholder="namn@exempel.se"
            className="w-full rounded-xl border bg-background px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Företag (valfritt)</label>
          <input name="company" placeholder="Företagsnamn" className="w-full rounded-xl border bg-background px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Meddelande (valfritt)</label>
          <textarea
            name="note"
            placeholder="Berätta kort hur du planerar använda Pro."
            className="w-full rounded-xl border bg-background px-3 py-2"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm hover:bg-accent"
        >
          Skicka ansökan
        </button>
        <p className="text-xs opacity-70">
          Genom att skicka formuläret godkänner du att vi kontaktar dig via e-post om Pro-åtkomst. Läs mer i vår
          <Link href="/pricing" className="ml-1 underline">
            FAQ
          </Link>
          .
        </p>
      </form>
    </main>
  );
}
