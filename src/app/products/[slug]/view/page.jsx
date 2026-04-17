import { redirect } from "next/navigation";

// CUSTOM DATA MODEL

export default async function ProductQuickView({
  params
}) {
  const {
    slug
  } = await params;
  redirect(`/products/${slug}`);
}