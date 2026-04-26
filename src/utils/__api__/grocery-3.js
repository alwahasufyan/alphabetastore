import { cache } from "react";
import { FALLBACK_PRODUCT_IMAGE, fetchProducts } from "utils/catalog";

const MAIN_CAROUSEL = [{
  id: "grocery-3-main-1",
  title: "Fresh picks delivered to your door",
  buttonText: "Shop Now",
  imgUrl: FALLBACK_PRODUCT_IMAGE
}];

const OFFER_CARDS = [{
  id: "grocery-3-offer-1",
  title: "Weekly Savings",
  discountOffer: "Save up to 20%",
  buttonText: "Explore Deals",
  imgUrl: FALLBACK_PRODUCT_IMAGE
}, {
  id: "grocery-3-offer-2",
  title: "Bundle Offers",
  discountOffer: "Buy More, Pay Less",
  buttonText: "View Bundles",
  imgUrl: FALLBACK_PRODUCT_IMAGE
}];

const getTopSailedProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 8);
});
const getAllProducts = cache(async () => {
  const products = await fetchProducts();
  return products;
});
const getOfferCards = cache(async () => {
  return OFFER_CARDS;
});
const getMainCarousel = cache(async () => {
  return MAIN_CAROUSEL;
});
export default {
  getOfferCards,
  getAllProducts,
  getMainCarousel,
  getTopSailedProducts
};