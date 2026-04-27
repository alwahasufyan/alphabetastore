import { redirect } from "next/navigation";
export const metadata = {
  title: "Brand Create - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default function BrandCreate() {
  redirect("/admin/products");
}
