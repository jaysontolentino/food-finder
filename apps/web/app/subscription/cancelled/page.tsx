import Link from "next/link";
import { getTranslations } from "@/i18n";
import type { SupportedLanguage } from "@/lib/api";

interface SubscriptionCancelledPageProps {
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

export default async function SubscriptionCancelledPage({
  searchParams,
}: SubscriptionCancelledPageProps) {
  const params = await searchParams;
  const language = getLanguage(params.lang);
  const t = getTranslations(language);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-8 w-8 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6l12 12M18 6 6 18"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {t.subscriptionCancelledTitle}
        </h1>

        <p className="mt-3 max-w-md text-gray-600">
          {t.subscriptionCancelledMessage}
        </p>

        <div className="mt-8 w-full rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm">
          <h2 className="font-semibold text-gray-900">
            {t.stillUseFoodFinder}
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {t.subscriptionCancelledDescription}
          </p>
        </div>

        <Link
          href={`/?lang=${language}`}
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          {t.backToFoodFinder}
        </Link>

        <p className="mt-4 text-sm text-gray-500">{t.subscribeAnytime}</p>
      </div>
    </main>
  );
}
