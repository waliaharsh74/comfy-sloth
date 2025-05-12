export const formatPrice = (number:number) => {
  const newNumber = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
  }).format(number / 100);
  return newNumber;
};

export function getUniqueValues<T extends Record<string, any>>(
  data: T[],
  key: keyof T
): string[] {
  const values = data.map((item) => item[key]);
  let items: string[];
  if (key === 'colors' && Array.isArray(values[0])) {
    items = (values as string[][]).flat();
  } else {
    items = values as string[];
  }
  return ['all', ...Array.from(new Set(items))];
}
