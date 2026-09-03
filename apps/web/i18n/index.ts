import de from "./de.json";
import en from "./en.json";
import fr from "./fr.json";
import nl from "./nl.json";

import type { SupportedLanguage } from "../lib/api";

export const translations = {
  en,
  nl,
  de,
  fr,
} as const;

export function getTranslations(language: SupportedLanguage) {
  return translations[language];
}
