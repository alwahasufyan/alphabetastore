import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
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
  const stockOutProducts = outOfStockCount > 0 ? [{
    product: "Out of stock products",
    stock: String(outOfStockCount),
    amount: 0
  }] : [];

  return <Card>
      <FlexBetween px={3} py={2.5}>
        <Typography variant="h5">Stock Out Products</Typography>
        <Button size="small" color="info" variant="outlined">
          All Products
        </Button>
      </FlexBetween>

      {stockOutProducts.length ? <DataListTable dataList={stockOutProducts} tableHeading={tableHeading} type="STOCK_OUT" /> : <Alert severity="success" sx={{ mx: 3, mb: 3 }}>
          No out-of-stock products right now.
        </Alert>}
    </Card>;
}