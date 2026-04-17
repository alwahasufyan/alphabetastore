
// LOCAL CUSTOM COMPONENT
import ProductForm from "../product-form";
import PageWrapper from "../../page-wrapper";
export default function EditProductPageView({
  slug
}) {
  return <PageWrapper title="Edit Product">
      <ProductForm slug={slug} />
    </PageWrapper>;
}