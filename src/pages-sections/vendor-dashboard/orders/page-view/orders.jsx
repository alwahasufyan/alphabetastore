"use client";

import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

// GLOBAL CUSTOM COMPONENTS
import OverlayScrollbar from "components/overlay-scrollbar";
import { TableHeader, TablePagination } from "components/data-table";

// GLOBAL CUSTOM HOOK
import useMuiTable from "hooks/useMuiTable";

// LOCAL CUSTOM COMPONENT
import OrderRow from "../order-row";
import SearchArea from "../../search-box";
import PageWrapper from "../../page-wrapper";
import { fetchAdminOrders } from "utils/orders";

// TABLE HEAD COLUMN DATA
import { tableHeading } from "../table-heading";


// =============================================================================


// =============================================================================

export default function OrdersPageView({
  orders: initialOrders = []
}) {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q")?.trim().toLowerCase() || "";
  const [orders, setOrders] = useState(Array.isArray(initialOrders) ? initialOrders : []);
  const [isLoading, setIsLoading] = useState(!initialOrders?.length);
  const [pageError, setPageError] = useState("");

  const loadOrders = useCallback(async () => {
    setPageError("");

    try {
      const data = await fetchAdminOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to load orders.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => orders.map(item => ({
    id: item.id,
    status: item.statusLabel,
    qty: item.items.length,
    amount: item.totalAmount,
    purchaseDate: item.createdAt,
    billingAddress: item.shippingAddress
  })).filter(item => {
    if (!searchTerm) return true;

    return [item.id, item.status, item.billingAddress].some(value => value?.toLowerCase().includes(searchTerm));
  }), [orders, searchTerm]);
  const {
    order,
    orderBy,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: filteredOrders,
    defaultSort: "purchaseDate",
    defaultOrder: "desc"
  });
  return <PageWrapper title="Orders">
      <SearchArea url="/admin/orders" buttonText="" searchPlaceholder="Search Order..." />

      {pageError ? <Alert severity="error" sx={{
      mb: 3
    }}>{pageError}</Alert> : null}

      <Card>
        <OverlayScrollbar>
          <TableContainer sx={{
          minWidth: 900
        }}>
            <Table>
              <TableHeader order={order} orderBy={orderBy} heading={tableHeading} onRequestSort={handleRequestSort} />

              <TableBody>
                {isLoading ? <tr>
                    <td colSpan={7}>
                      <Stack alignItems="center" justifyContent="center" py={6}>
                        <CircularProgress color="info" />
                      </Stack>
                    </td>
                  </tr> : filteredList.map(order => <OrderRow order={order} key={order.id} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </OverlayScrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} count={Math.ceil(filteredList.length / rowsPerPage)} />
        </Stack>
      </Card>
    </PageWrapper>;
}