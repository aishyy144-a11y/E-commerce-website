const mapSpecs = (specs) => {
  if (!specs) return undefined;
  if (specs instanceof Map) {
    const obj = {};
    specs.forEach((value, key) => { obj[key] = value; });
    return obj;
  }
  return specs;
};

const firstImage = (images) => (images?.length ? [images[0]] : []);

const toCardProduct = (product, { includeDescription = false, includeSpecs = false } = {}) => {
  const result = {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    modelNumber: product.modelNumber,
    brand: product.brand,
    price: product.price,
    category: product.category,
    images: firstImage(product.images),
    requiresQuote: product.requiresQuote,
    stock: product.stock,
    createdAt: product.createdAt,
    subCategory: product.subCategory,
  };
  if (includeDescription) result.description = product.description;
  if (includeSpecs) result.specifications = mapSpecs(product.specifications);
  return result;
};

const toCardProducts = (products, options) => products.map((p) => toCardProduct(p, options));

module.exports = { toCardProduct, toCardProducts, mapSpecs };
