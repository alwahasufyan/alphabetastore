
// GLOBAL CUSTOM COMPONENTS
import SalesLayout from "components/layouts/sales-layout";

// API FUNCTIONS
import api from "utils/__api__/layout";
export default async function Layout({
  children
}) {
  const data = await api.getLayoutData();
  return <SalesLayout data={data}>{children}</SalesLayout>;
}