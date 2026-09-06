import Link from "next/link";
import { getTranslations } from "@/i18n";
import type { SupportedLanguage } from "@/lib/api";

interface SubscriptionSuccessPageProps {
  searchParams: Promise<{
    lang?: string;
  }>;
}

const supportedLanguages: SupportedLanguage[] = ["en", "nl", "de", "fr"];

function getLanguage(value?: string): SupportedLanguage {
  if (value && supportedLanguages.includes(value as SupportedLanguage)) {
    return value as SupportedLanguage;
  }

  return "en";
}

export default async function SubscriptionSuccessPage({
  searchParams,
}: SubscriptionSuccessPageProps) {
  const params = await searchParams;
  const language = getLanguage(params.lang);
  const t = getTranslations(language);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 12 4 4L19 6"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {t.subscriptionSuccessTitle}
        </h1>

        <p className="mt-3 max-w-md text-gray-600">
          {t.subscriptionSuccessMessage}
        </p>

        <div className="mt-8 w-full rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50">
              <svg
                className="h-5 w-5 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 12 4 4L19 6"
                />
              </svg>
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                {t.nutritionAccessUnlocked}
              </h2>

              <p className="text-sm text-gray-500">
                {t.nutritionAccessDescription}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              t.energy,
              t.fatAndSaturatedFat,
              t.carbohydratesAndSugars,
              t.proteinAndFiber,
              t.salt,
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <span className="text-green-600">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <Link
          href={`/?lang=${language}`}
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          {t.startSearching}
        </Link>
      </div>
    </main>
  );
}
