"use client";

import { useEffect, useState } from "react";

import {
  createCheckoutSession,
  getSubscriptionStatus,
} from "@/lib/subscription";

interface SubscriptionButtonProps {
  onStatusChange?: (active: boolean) => void;
}

export function SubscriptionButton({
  onStatusChange,
}: SubscriptionButtonProps) {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubscription() {
      try {
        const isActive = await getSubscriptionStatus();

        setActive(isActive);
        onStatusChange?.(isActive);
      } catch {
        setError("Unable to load subscription status.");
      } finally {
        setLoading(false);
      }
    }

    loadSubscription();
  }, [onStatusChange]);

  async function handleSubscribe() {
    try {
      setCheckoutLoading(true);
      setError(null);

      const checkoutUrl = await createCheckoutSession();

      window.location.href = checkoutUrl;
    } catch {
      setError("Unable to start checkout.");
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <button
        type="button"
        disabled
        className="rounded-lg border px-4 py-2 text-sm opacity-60"
      >
        Checking subscription...
      </button>
    );
  }

  if (active) {
    return (
      <div className="rounded-lg border px-4 py-2 text-sm">
        ✓ Subscription active
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={checkoutLoading}
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {checkoutLoading ? "Opening checkout..." : "Subscribe"}
      </button>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
