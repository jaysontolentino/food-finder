interface NutritionTranslations {
  nutrient: string;
  per100g: string;
  energy: string;
  fat: string;
  saturatedFat: string;
  carbohydrates: string;
  sugars: string;
  fiber: string;
  protein: string;
  salt: string;
}

interface NutritionTableProps {
  nutrition: Record<string, number | string | undefined>;
  translations: NutritionTranslations;
}

interface NutritionRow {
  key: string;
  label: string;
  value: number | string | undefined;
  unit: string;
}

function formatValue(value: number | string | undefined): string {
  if (value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "number") {
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  }

  return value;
}

export function NutritionTable({
  nutrition,
  translations,
}: NutritionTableProps) {
  const nutritionRows = [
    {
      key: "energy-kcal_100g",
      label: translations.energy,
      unit: "kcal",
    },
    {
      key: "fat_100g",
      label: translations.fat,
      unit: "g",
    },
    {
      key: "saturated-fat_100g",
      label: translations.saturatedFat,
      unit: "g",
    },
    {
      key: "carbohydrates_100g",
      label: translations.carbohydrates,
      unit: "g",
    },
    {
      key: "sugars_100g",
      label: translations.sugars,
      unit: "g",
    },
    {
      key: "fiber_100g",
      label: translations.fiber,
      unit: "g",
    },
    {
      key: "proteins_100g",
      label: translations.protein,
      unit: "g",
    },
    {
      key: "salt_100g",
      label: translations.salt,
      unit: "g",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-5 py-3 text-left font-medium text-gray-600">
              {translations.nutrient}
            </th>

            <th className="px-5 py-3 text-right font-medium text-gray-600">
              {translations.per100g}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {nutritionRows.map((row) => (
            <tr key={row.key} className="transition hover:bg-gray-50">
              <td className="px-5 py-4 text-gray-700">{row.label}</td>

              <td className="px-5 py-4 text-right font-medium text-gray-900">
                {formatValue(nutrition[row.key])}
                {nutrition[row.key] !== undefined && (
                  <span className="ml-1 text-gray-500">{row.unit}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
