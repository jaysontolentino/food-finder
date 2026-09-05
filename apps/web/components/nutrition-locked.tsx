"use client";

import { useState } from "react";

import { createCheckoutSession } from "@/lib/subscription";

interface NutritionLockedProps {
  translations: {
    nutritionLocked: string;
    nutritionSubscriptionMessage: string;
    subscribe: string;
    openingCheckout: string;
    checkoutError: string;
  };
}

export function NutritionLocked({ translations }: NutritionLockedProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    try {
      setLoading(true);
      setError(null);

      const checkoutUrl = await createCheckoutSession();

      window.location.href = checkoutUrl;
    } catch {
      setError("Unable to start checkout.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-gray-50 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm">
        🔒
      </div>

      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        {translations.nutritionLocked}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        {translations.nutritionSubscriptionMessage}
      </p>

      <button
        type="button"
        onClick={handleSubscribe}
        disabled={loading}
        className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? translations.openingCheckout : translations.subscribe}
      </button>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
