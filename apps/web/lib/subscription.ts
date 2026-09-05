const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface SubscriptionStatus {
  active: boolean;
}

export async function getSubscriptionStatus(): Promise<boolean> {
  const response = await fetch(`${API_URL}/api/subscription`);

  if (!response.ok) {
    throw new Error("Failed to load subscription status");
  }

  const data = (await response.json()) as SubscriptionStatus;

  return data.active;
}

export async function createCheckoutSession(): Promise<string> {
  const response = await fetch(`${API_URL}/api/subscription/checkout`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to create checkout session");
  }

  const data = (await response.json()) as { url: string | null };

  if (!data.url) {
    throw new Error("Stripe Checkout URL was not returned");
  }

  return data.url;
}
