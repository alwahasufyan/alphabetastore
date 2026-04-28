import duotone from "icons/duotone";
export const navigation = [{
  type: "label",
  label: "Admin"
}, {
  name: "Dashboard",
  icon: duotone.Dashboard,
  path: "/vendor/dashboard"
}, {
  name: "Products",
  icon: duotone.Products,
  children: [{
    name: "Product List",
    path: "/admin/products"
  }, {
    name: "Create Product",
    path: "/admin/products/create"
  }]
}, {
  name: "Categories",
  icon: duotone.Accounts,
  children: [{
    name: "Category List",
    path: "/admin/categories"
  }, {
    name: "Create Category",
    path: "/admin/categories/create"
  }]
}, {
  name: "Orders",
  icon: duotone.Order,
  children: [{
    name: "Order List",
    path: "/admin/orders"
  }, {
    name: "Order Details",
    path: "/admin/orders/f0ba538b-c8f3-45ce-b6c1-209cf07ba5f8"
  }]
}, {
  name: "Payments",
  icon: duotone.Refund,
  path: "/admin/payments"
}, {
  name: "Support Tickets",
  icon: duotone.ElementHub,
  path: "/admin/tickets"
}, {
  name: "Sellers",
  icon: duotone.Seller,
  children: [{
    name: "Seller Package",
    path: "/admin/seller-package"
  }]
}, {
  type: "label",
  label: "Vendor"
}, {
  name: "Payments",
  icon: duotone.ProjectChart,
  children: [{
    name: "Payout Settings",
    path: "/vendor/payout-settings"
  }]
}, {
  name: "Shop Setting",
  icon: duotone.SiteSetting,
  path: "/vendor/shop-settings"
}, {
  name: "Account Settings",
  icon: duotone.AccountSetting,
  path: "/vendor/account-settings"
}, {
  name: "Site Settings",
  icon: duotone.SiteSetting,
  path: "/vendor/site-settings"
}, {
  name: "Logout",
  icon: duotone.Session,
  path: "/",
  action: "logout"
}];