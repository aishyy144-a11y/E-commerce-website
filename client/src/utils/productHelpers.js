export const QUOTE_PRICE_THRESHOLD = 50000;

export const requiresQuotation = (product) => {
  if (!product) return false;
  return Boolean(product.requiresQuote || product.price >= QUOTE_PRICE_THRESHOLD);
};
