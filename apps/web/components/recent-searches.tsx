import type { RecentSearch } from "@/lib/api";

interface RecentSearchesProps {
  searches: RecentSearch[];
  title: string;
  onSelect: (query: string) => void;
}

export function RecentSearches({
  searches,
  title,
  onSelect,
}: RecentSearchesProps) {
  if (searches.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>

      <div className="flex flex-wrap gap-2">
        {searches.map((search) => (
          <button
            key={search.id}
            type="button"
            onClick={() => onSelect(search.query)}
            className="rounded-full border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            {search.query}
          </button>
        ))}
      </div>
    </section>
  );
}
