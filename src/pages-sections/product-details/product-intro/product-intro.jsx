import Link from "next/link";

// MUI
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// LOCAL CUSTOM COMPONENTS
import AddToCart from "./add-to-cart";
import ProductGallery from "./product-gallery";

// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";

// STYLED COMPONENTS
import { StyledRoot } from "./styles";

// CUSTOM DATA MODEL


// ================================================================


// ================================================================

export default function ProductIntro({
  product
}) {
  const hasStock = product.stockQty > 0;

  return <StyledRoot>
      <Grid container spacing={3} justifyContent="space-around">
        {/* IMAGE GALLERY AREA */}
        <Grid size={{
        lg: 6,
        md: 7,
        xs: 12
      }}>
          <ProductGallery images={product.images} />
        </Grid>

        <Grid size={{
        lg: 5,
        md: 5,
        xs: 12
      }}>
          <Typography variant="h1">{product.title}</Typography>

          {product.categoryName ? <Typography variant="body1">
              Category: <strong>{product.categoryName}</strong>
            </Typography> : null}

          {product.shortDescription ? <Typography variant="body1" sx={{
          mt: 1.5,
          color: "text.secondary"
        }}>
              {product.shortDescription}
            </Typography> : null}

          {/* PRICE & STOCK */}
          <div className="price">
            <Typography variant="h2" sx={{
            color: "primary.main",
            mb: 0.5,
            lineHeight: 1
          }}>
              {currency(product.price)}
            </Typography>

            <p>{hasStock ? `${product.stockQty} in stock` : "Out of stock"}</p>
          </div>

          {/* ADD TO CART BUTTON */}
          <AddToCart product={product} />
        </Grid>
      </Grid>
    </StyledRoot>;
}