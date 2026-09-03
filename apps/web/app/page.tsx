"use client";

import { useEffect, useState } from "react";

import {
  getRecentSearches,
  searchProducts,
  type Product,
  type RecentSearch,
  type SupportedLanguage,
} from "@/lib/api";

import { getTranslations } from "@/i18n";
import { LanguageSelector } from "@/components/language-selector";
import { ProductGrid } from "@/components/product-grid";
import { RecentSearches } from "@/components/recent-searches";
import { SearchBar } from "@/components/search-bar";

export default function Home() {
  const [language, setLanguage] = useState<SupportedLanguage>("en");

  const [products, setProducts] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = getTranslations(language);

  useEffect(() => {
    async function loadRecentSearches() {
      try {
        const searches = await getRecentSearches();
        setRecentSearches(searches);
      } catch {
        // Recent searches are supplementary UI.
        // Don't prevent the main application from working.
      }
    }

    loadRecentSearches();
  }, []);

  async function handleSearch(query: string) {
    setLoading(true);
    setError(null);

    try {
      const results = await searchProducts(query, language);

      setProducts(results);

      const searches = await getRecentSearches();
      setRecentSearches(searches);
    } catch (error) {
      console.error(error);
      setError(t.searchError);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  function handleRecentSearch(query: string) {
    void handleSearch(query);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{t.title}</h1>

            <p className="mt-1 text-sm text-gray-600 sm:text-base">
              {t.subtitle}
            </p>
          </div>

          <LanguageSelector language={language} onChange={setLanguage} />
        </header>

        <section className="mb-8">
          <SearchBar
            placeholder={t.searchPlaceholder}
            buttonLabel={t.search}
            loading={loading}
            onSearch={handleSearch}
          />
        </section>

        {recentSearches.length > 0 && (
          <section className="mb-10">
            <RecentSearches
              searches={recentSearches}
              title={t.recentSearches}
              onSelect={handleRecentSearch}
            />
          </section>
        )}

        <section>
          <h2 className="mb-5 text-xl font-semibold">{t.products}</h2>

          {error ? (
            <p className="py-10 text-center text-red-600">{error}</p>
          ) : (
            <ProductGrid
              products={products}
              brandLabel={t.brand}
              emptyMessage={t.noResults}
            />
          )}
        </section>
      </div>
    </main>
  );
}
