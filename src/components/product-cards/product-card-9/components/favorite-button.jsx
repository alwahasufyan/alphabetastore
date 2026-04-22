import WishlistToggleButton from "components/wishlist/wishlist-toggle-button";

export default function FavoriteButton({
  productId
}) {
  return <WishlistToggleButton productId={productId} sx={{
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1
  }} />;
}