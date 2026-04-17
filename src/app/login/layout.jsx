import AuthLayout from "pages-sections/sessions/layout";
import LoginBottom from "pages-sections/sessions/components/login-bottom";
export default function Layout({
  children
}) {
  return <AuthLayout bottomContent={<LoginBottom />}>{children}</AuthLayout>;
}