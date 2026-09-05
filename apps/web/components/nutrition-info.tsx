import type { Product } from "@/lib/api";

interface NutritionInfoProps {
  nutrition: NonNullable<Product["nutrition"]>;
}

interface NutritionItem {
  label: string;
  value: number | string | undefined;
  unit: string;
}

function formatValue(value: number | string | undefined): string {
  if (value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }

  return value;
}

export function NutritionInfo({ nutrition }: NutritionInfoProps) {
  const items: NutritionItem[] = [
    {
      label: "Energy",
      value: nutrition["energy-kcal_100g"] ?? nutrition["energy-kcal"],
      unit: "kcal",
    },
    {
      label: "Fat",
      value: nutrition["fat_100g"],
      unit: "g",
    },
    {
      label: "Carbohydrates",
      value: nutrition["carbohydrates_100g"],
      unit: "g",
    },
    {
      label: "Protein",
      value: nutrition["proteins_100g"],
      unit: "g",
    },
    {
      label: "Sugars",
      value: nutrition["sugars_100g"],
      unit: "g",
    },
    {
      label: "Salt",
      value: nutrition["salt_100g"],
      unit: "g",
    },
  ];

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="mb-3 text-sm font-semibold">Nutrition per 100g</h3>

      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-md border p-2">
            <p className="text-xs text-gray-500">{item.label}</p>

            <p className="text-sm font-medium">
              {formatValue(item.value)}
              {item.value !== undefined && item.value !== "" && ` ${item.unit}`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
