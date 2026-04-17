import VendorDashboardLayout from "components/layouts/vendor-dashboard";
import AuthGuard from "components/auth/auth-guard";
export default function Layout({
  children
}) {
  return <VendorDashboardLayout>
      <AuthGuard allowedRoles={["ADMIN"]}>{children}</AuthGuard>
    </VendorDashboardLayout>;
}