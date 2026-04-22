"use client";

import MuiLink from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import OverlayScrollbar from "components/overlay-scrollbar";
import { TableHeader, TablePagination } from "components/data-table";
import useMuiTable from "hooks/useMuiTable";
import { currency } from "lib";
import SearchArea from "pages-sections/vendor-dashboard/search-box";
import PageWrapper from "pages-sections/vendor-dashboard/page-wrapper";
import { fetchAdminPayments, reviewAdminPayment } from "utils/payments";

const tableHeading = [{
  id: "orderId",
  label: "Order",
  align: "left"
}, {
  id: "customer",
  label: "Customer",
  align: "left"
}, {
  id: "method",
  label: "Method",
  align: "left"
}, {
  id: "amount",
  label: "Amount",
  align: "left"
}, {
  id: "statusLabel",
  label: "Status",
  align: "left"
}, {
  id: "receipt",
  label: "Receipt",
  align: "left"
}, {
  id: "action",
  label: "Action",
  align: "center"
}];

export default function PaymentsPageView() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q")?.trim().toLowerCase() || "";
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [actionState, setActionState] = useState({});

  const loadPayments = useCallback(async () => {
    setPageError("");

    try {
      const data = await fetchAdminPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to load payments.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const filteredPayments = useMemo(() => payments.map(payment => ({
    ...payment,
    customer: payment.order?.fullName || "Customer",
    method: payment.paymentMethodName,
    receiptUrl: payment.receipt?.fileUrl || ""
  })).filter(payment => {
    if (!searchTerm) return true;

    return [payment.orderId, payment.customer, payment.method, payment.statusLabel, payment.receiptUrl].some(value => String(value || "").toLowerCase().includes(searchTerm));
  }), [payments, searchTerm]);

  const {
    order,
    orderBy,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: filteredPayments,
    defaultSort: "createdAt",
    defaultOrder: "desc"
  });

  const handleReview = async (paymentId, status) => {
    setActionState(current => ({
      ...current,
      [paymentId]: status
    }));

    try {
      const updatedPayment = await reviewAdminPayment(paymentId, {
        status
      });

      setPayments(current => current.map(item => item.id === updatedPayment.id ? updatedPayment : item));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to review payment.");
    } finally {
      setActionState(current => {
        const nextState = {
          ...current
        };

        delete nextState[paymentId];
        return nextState;
      });
    }
  };

  return <PageWrapper title="Payments">
      <SearchArea url="/admin/payments" buttonText="" searchPlaceholder="Search Payment..." />

      {pageError ? <Alert severity="error" sx={{
      mb: 3
    }}>{pageError}</Alert> : null}

      <Card>
        <OverlayScrollbar>
          <TableContainer sx={{
          minWidth: 1100
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
                  </tr> : filteredList.length ? filteredList.map(payment => <tr key={payment.id}>
                      <td style={{
                padding: "1rem"
              }}>
                        <Typography variant="body2">#{payment.orderId.slice(0, 8).toUpperCase()}</Typography>
                      </td>

                      <td style={{
                padding: "1rem"
              }}>
                        <Typography variant="body2">{payment.customer}</Typography>
                      </td>

                      <td style={{
                padding: "1rem"
              }}>
                        <Typography variant="body2">{payment.method}</Typography>
                      </td>

                      <td style={{
                padding: "1rem"
              }}>
                        <Typography variant="body2">{currency(payment.amount)}</Typography>
                      </td>

                      <td style={{
                padding: "1rem"
              }}>
                        <Typography variant="body2">{payment.statusLabel}</Typography>
                      </td>

                      <td style={{
                padding: "1rem"
              }}>
                        {payment.receiptUrl ? <MuiLink href={payment.receiptUrl} target="_blank" rel="noreferrer">View receipt</MuiLink> : <Typography variant="body2" color="text.secondary">No receipt</Typography>}
                      </td>

                      <td style={{
                padding: "1rem"
              }}>
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button size="small" variant="contained" color="success" disabled={payment.status !== "PENDING" || Boolean(actionState[payment.id])} onClick={() => handleReview(payment.id, "APPROVED")}>
                            {actionState[payment.id] === "APPROVED" ? "Approving..." : "Approve"}
                          </Button>

                          <Button size="small" variant="outlined" color="error" disabled={payment.status !== "PENDING" || Boolean(actionState[payment.id])} onClick={() => handleReview(payment.id, "REJECTED")}>
                            {actionState[payment.id] === "REJECTED" ? "Rejecting..." : "Reject"}
                          </Button>
                        </Stack>
                      </td>
                    </tr>) : <tr>
                    <td colSpan={7}>
                      <Stack alignItems="center" justifyContent="center" py={6}>
                        <Typography color="text.secondary">No payments found for the current filters.</Typography>
                      </Stack>
                    </td>
                  </tr>}
              </TableBody>
            </Table>
          </TableContainer>
        </OverlayScrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} count={Math.max(1, Math.ceil(filteredPayments.length / rowsPerPage))} />
        </Stack>
      </Card>
    </PageWrapper>;
}