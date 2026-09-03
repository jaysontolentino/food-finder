"use client";

import type { SupportedLanguage } from "@/lib/api";

interface LanguageSelectorProps {
  language: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
}

const languages: Array<{
  value: SupportedLanguage;
  label: string;
}> = [
  { value: "en", label: "English" },
  { value: "nl", label: "Nederlands" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
];

export function LanguageSelector({
  language,
  onChange,
}: LanguageSelectorProps) {
  return (
    <select
      value={language}
      onChange={(event) => onChange(event.target.value as SupportedLanguage)}
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gray-500"
      aria-label="Select language"
    >
      {languages.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
