import { fetchWishlistItems } from "utils/wishlist";

export const getWishListProducts = async (page = 1) => {
  const PAGE_SIZE = 6;
  const wishlistItems = await fetchWishlistItems();
  const products = wishlistItems.map(item => item.product).filter(Boolean);
  const currentProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    products: currentProducts,
    totalPages: Math.ceil(products.length / PAGE_SIZE)
  };
};