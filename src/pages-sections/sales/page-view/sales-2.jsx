import Container from "@mui/material/Container";

// LOCAL CUSTOM COMPONENTS
import ProductList from "../product-list";
import ProductPagination from "../product-pagination";

// CUSTOM DATA MODEL


// ==============================================================


// ==============================================================

export default function SalesTwoPageView({
  products,
  page,
  pageSize,
  totalProducts
}) {
  return <Container className="mt-2">
      <ProductList products={products} />
      <ProductPagination page={page} perPage={pageSize} totalProducts={totalProducts} />
    </Container>;
}