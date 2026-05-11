export const formatPrice = (price) => {
  return `Rp ${Number(price).toLocaleString("id-ID")}`;
};