export const CATEGORIES = [
  { value: 'Food', label: 'Food', emoji: '🍛' },
  { value: 'Groceries', label: 'Groceries', emoji: '🛒' },
  { value: 'Electricity', label: 'Electricity', emoji: '⚡' },
  { value: 'Water', label: 'Water', emoji: '💧' },
  { value: 'Internet', label: 'Internet', emoji: '📶' },
  { value: 'Fuel', label: 'Fuel', emoji: '⛽' },
  { value: 'Medical', label: 'Medical', emoji: '🏥' },
  { value: 'Education', label: 'Education', emoji: '🎓' },
  { value: 'Entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'Shopping', label: 'Shopping', emoji: '🛍' },
  { value: 'Rent', label: 'Rent', emoji: '🏠' },
  { value: 'Transport', label: 'Transport', emoji: '🚕' },
  { value: 'Others', label: 'Others', emoji: '📦' },
] as const;

export type ExpenseCategoryValue = typeof CATEGORIES[number]['value'];
