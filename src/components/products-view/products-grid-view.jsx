import Grid from "@mui/material/Grid";

// GLOBAL CUSTOM COMPONENTS
import ProductCard16 from "components/product-cards/product-card-16";

// CUSTOM DATA MODEL


// ========================================================


// ========================================================

export default function ProductsGridView({
  products
}) {
  return <Grid container spacing={3}>
      {products.map(product => <Grid size={{
      lg: 4,
      sm: 6,
      xs: 12
    }} key={product.id}>
          <ProductCard16 product={product} />
        </Grid>)}
    </Grid>;
}