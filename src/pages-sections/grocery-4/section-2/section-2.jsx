import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// GLOBAL CUSTOM COMPONENTS
import ProductCard14 from "components/product-cards/product-card-14";

// CUSTOM DATA MODEL


// ==============================================================


// ==============================================================

export default async function Section2({
  products,
  breadcrumb = "All Products"
}) {
  return <div className="mb-4">
      <Typography variant="body1" sx={{
      mb: 3,
      fontWeight: 600,
      fontSize: 18
    }}>
        {breadcrumb}
      </Typography>

      <Grid container spacing={3}>
        {products.map(product => <Grid size={{
        xs: 12,
        sm: 6,
        md: 4,
        xl: 3
      }} key={product.id}>
            <ProductCard14 product={product} />
          </Grid>)}
      </Grid>
    </div>;
}