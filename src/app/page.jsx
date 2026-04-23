import { redirect } from "next/navigation";

export const metadata = {
  title: "Alphabeta",
  description: "Alphabeta storefront",
  authors: [{
    name: "ALPHABETA"
  }],
  keywords: ["alphabeta", "e-commerce", "next.js", "react"]
};
export default function IndexPage() {
  redirect("/market-1");
}