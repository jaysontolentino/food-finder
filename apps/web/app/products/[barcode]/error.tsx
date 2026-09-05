"use client";

import Link from "next/link";

export default function Error() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/" className="text-sm font-medium hover:underline">
        ← Back to search
      </Link>

      <div className="mt-12 rounded-2xl border p-8 text-center">
        <h1 className="text-lg font-semibold">Product not found</h1>

        <p className="mt-2 text-sm text-gray-500">
          We couldn't find this product.
        </p>
      </div>
    </main>
  );
}
