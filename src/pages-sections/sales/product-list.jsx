import { memo } from "react";
import Grid from "@mui/material/Grid";

// GLOBAL CUSTOM COMPONENT
import ProductCard17 from "components/product-cards/product-card-17";

// CUSTOM DATA MODEL


// ==============================================================


// ==============================================================

export default memo(function ProductList({
  products
}) {
  return <Grid container spacing={3} minHeight={500}>
      {products.map(product => <Grid size={{
      lg: 3,
      md: 4,
      sm: 6,
      xs: 12
    }} key={product.id}>
          <ProductCard17 product={product} />
        </Grid>)}
    </Grid>;
});