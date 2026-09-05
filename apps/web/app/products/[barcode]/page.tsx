import Link from "next/link";

import { getProductByBarcode } from "@/lib/api";
import { getTranslations } from "@/i18n";
import { NutritionLocked } from "@/components/nutrition-locked";
import { NutritionTable } from "@/components/nutrition-table";

import type { SupportedLanguage } from "@/lib/api";

interface ProductDetailsPageProps {
  params: Promise<{
    barcode: string;
  }>;
  searchParams: Promise<{
    lang?: string;
  }>;
}

const supportedLanguages: SupportedLanguage[] = ["en", "nl", "de", "fr"];

function isSupportedLanguage(
  value: string | undefined,
): value is SupportedLanguage {
  return (
    value !== undefined &&
    supportedLanguages.includes(value as SupportedLanguage)
  );
}

export default async function ProductDetailsPage({
  params,
  searchParams,
}: ProductDetailsPageProps) {
  const { barcode } = await params;
  const query = await searchParams;

  const language = isSupportedLanguage(query.lang) ? query.lang : "en";

  const t = getTranslations(language);

  let product;

  try {
    product = await getProductByBarcode(barcode, language);
  } catch {
    product = null;
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href={`/?lang=${language}`}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline"
        >
          ← {t.backToSearch}
        </Link>

        <div className="mt-12 rounded-2xl border p-8 text-center">
          <h1 className="text-lg font-semibold">{t.productNotFound}</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href={`/?lang=${language}`}
        className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline"
      >
        ← {t.backToSearch}
      </Link>

      <section className="mt-8 grid gap-8 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
        <div className="flex min-h-80 items-center justify-center rounded-xl bg-gray-50 p-8">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-80 w-full object-contain"
            />
          ) : (
            <span className="text-sm text-gray-400">{t.noImage}</span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-500">
            {product.brand ?? t.unknownBrand}
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {product.name}
          </h1>

          <div className="mt-6 border-t pt-5">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              {t.barcode}
            </p>

            <p className="mt-1 font-mono text-sm text-gray-700">
              {product.barcode}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900">{t.nutrition}</h2>

        <p className="mt-1 text-sm text-gray-500">{t.nutritionPer100g}</p>

        <div className="mt-5">
          {product.nutrition ? (
            <NutritionTable nutrition={product.nutrition} translations={t} />
          ) : (
            <NutritionLocked translations={t} />
          )}
        </div>
      </section>
    </main>
  );
}
