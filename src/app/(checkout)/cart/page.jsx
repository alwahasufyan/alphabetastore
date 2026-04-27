import { CartPageView } from "pages-sections/cart/page-view";
export const metadata = {
  title: "Cart - Alphabeta Store",
  description: "Alphabeta Store for the Libya market.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default function Cart() {
  return <CartPageView />;
}
