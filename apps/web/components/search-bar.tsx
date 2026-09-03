"use client";

import { SubmitEvent, useState } from "react";

interface SearchBarProps {
  placeholder: string;
  buttonLabel: string;
  loading: boolean;
  onSearch: (query: string) => void;
}

export function SearchBar({
  placeholder,
  buttonLabel,
  loading,
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    onSearch(trimmedQuery);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-500"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "..." : buttonLabel}
      </button>
    </form>
  );
}
