import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// GLOBAL CUSTOM COMPONENTS
import { FlexBetween } from "components/flex-box";

// LOCAL CUSTOM COMPONENT
import DataListTable from "./table";

// DATA TYPES


// table column list
const tableHeading = [{
  id: "product",
  label: "Product",
  alignRight: false
}, {
  id: "stock",
  label: "Stock",
  alignRight: false
}, {
  id: "amount",
  label: "Amount",
  alignCenter: true
}];
export default function StockOutProducts({
  outOfStockCount = 0,
  recentOrders = []
}) {
  const stockOutProducts = [{
    product: "Out of stock products",
    stock: String(outOfStockCount),
    amount: 0
  }, {
    product: "Recent orders snapshot",
    stock: String(Array.isArray(recentOrders) ? recentOrders.length : 0),
    amount: (Array.isArray(recentOrders) ? recentOrders : []).reduce((sum, item) => sum + Number(item?.totalAmountUsd || 0), 0)
  }];

  return <Card>
      <FlexBetween px={3} py={2.5}>
        <Typography variant="h5">Stock Out Products</Typography>
        <Button size="small" color="info" variant="outlined">
          All Products
        </Button>
      </FlexBetween>

      <DataListTable dataList={stockOutProducts} tableHeading={tableHeading} type="STOCK_OUT" />
    </Card>;
}