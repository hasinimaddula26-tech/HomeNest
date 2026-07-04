export const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Dairy",
  "Cleaning",
  "Medicine",
  "Snacks",
  "Others"
] as const;

export type GroceryCategoryType = typeof CATEGORIES[number];
