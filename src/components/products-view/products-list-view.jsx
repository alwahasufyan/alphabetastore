import ProductCard9 from "components/product-cards/product-card-9";

// CUSTOM DATA MODEL


// ==========================================================


// ==========================================================

export default function ProductsListView({
  products
}) {
  return products.map(product => <ProductCard9 key={product.id} product={product} />);
}