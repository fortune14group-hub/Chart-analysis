import Brand from "@/components/Brand";
import TrustBar from "@/components/TrustBar";
import AuthButtons from "@/components/AuthButtons";
import UploadForm from "@/components/UploadForm";
import { sv } from "@/lib/i18n/sv";
import Link from "next/link";
import { analyzeImage } from "@/lib/actions/analyze";

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-6">
            <Brand />
            <nav className="hidden gap-4 sm:flex">
              <Link href="/" className="text-sm opacity-80 hover:opacity-100">
                Start
              </Link>
              <Link href="/pricing" className="text-sm opacity-80 hover:opacity-100">
                Priser & FAQ
              </Link>
            </nav>
          </div>
          <div>
            <h1 className="text-3xl font-semibold">{sv.brand.title}</h1>
            <p className="mt-2 max-w-xl text-sm opacity-80">{sv.brand.subtitle}</p>
          </div>
        </div>
        <AuthButtons />
      </header>

      <UploadForm action={analyzeImage} />

      <TrustBar />
    </main>
  );
}
