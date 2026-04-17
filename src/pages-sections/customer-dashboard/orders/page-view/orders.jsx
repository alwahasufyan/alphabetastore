import { Fragment } from "react";

// CUSTOM COMPONENTS
import Packages from "icons/Packages";
import OrderRow from "../order-row";
import Pagination from "../../pagination";
import DashboardHeader from "../../dashboard-header";

// CUSTOM DATA MODEL


// ====================================================


// ====================================================

export function OrdersPageView({
  orders,
  totalPages
}) {
  return <Fragment>
      <DashboardHeader Icon={Packages} title="My Orders" />

      {orders.map(order => <OrderRow order={order} key={order.id} />)}

      <Pagination count={totalPages} />
    </Fragment>;
}