export const fetchProducts = async () => {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Failed to fetch');
  return await res.json();
};
