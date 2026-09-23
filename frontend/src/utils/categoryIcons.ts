const CATEGORY_ICONS: Record<string, string> = {
  "produits laitiers": "🥛",
  "laitiers": "🥛",
  "légumes": "🥬",
  "legumes": "🥬",
  "fruits": "🍎",
  "viandes": "🍖",
  "viande": "🍖",
  "boissons": "🥤",
  "conserves": "🥫",
  "produits surgelés": "❄️",
  "surgelés": "❄️",
  "surgeles": "❄️",
  "céréales": "🌾",
  "pain": "🍞",
  "poissons": "🐟",
  "desserts": "🍰",
  "snacks": "🍿",
};

export const getCategoryIcon = (
  categoryName: string
): string => {
  const key = categoryName.trim().toLowerCase();

  return CATEGORY_ICONS[key] || "📦";
};