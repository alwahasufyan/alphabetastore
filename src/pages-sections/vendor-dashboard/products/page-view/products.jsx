"use client";

import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// GLOBAL CUSTOM COMPONENTS
import OverlayScrollbar from "components/overlay-scrollbar";
import { TableHeader, TablePagination } from "components/data-table";

// GLOBAL CUSTOM HOOK
import { getComparator, stableSort } from "hooks/useMuiTable";

//  LOCAL CUSTOM COMPONENT
import ProductRow from "../product-row";
import SearchArea from "../../search-box";
import PageWrapper from "../../page-wrapper";
import { ACTIVE_STATUS, ALL_PRODUCT_STATUS, INACTIVE_STATUS, fetchAdminProducts, mapAdminProduct } from "utils/admin-catalog";

const PAGE_SIZE = 10;

// TABLE HEADING DATA LIST
const tableHeading = [{
  id: "name",
  label: "Name",
  align: "left"
}, {
  id: "categoryName",
  label: "Category",
  align: "left"
}, {
  id: "price",
  label: "Price",
  align: "left"
}, {
  id: "status",
  label: "Status",
  align: "left"
}, {
  id: "action",
  label: "Action",
  align: "center"
}];


// =============================================================================


// =============================================================================

export default function ProductsPageView({
  products: initialProducts = []
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q")?.trim() || "";
  const currentPage = Math.max(Number(searchParams.get("page") || 1), 1);
  const statusFilter = searchParams.get("status") || ALL_PRODUCT_STATUS;
  const [products, setProducts] = useState(Array.isArray(initialProducts) ? initialProducts : []);
  const [pagination, setPagination] = useState({
    page: currentPage,
    limit: PAGE_SIZE,
    total: Array.isArray(initialProducts) ? initialProducts.length : 0,
    totalPages: 1
  });
  const [isLoading, setIsLoading] = useState(!initialProducts?.length);
  const [pageError, setPageError] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setPageError("");

    try {
      const response = await fetchAdminProducts({
        q: searchTerm,
        status: statusFilter,
        page: currentPage,
        limit: PAGE_SIZE
      });

      setProducts(Array.isArray(response?.items) ? response.items : []);
      setPagination(response?.pagination || {
        page: currentPage,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 1
      });
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to load products");
      setProducts([]);
      setPagination({
        page: currentPage,
        limit: PAGE_SIZE,
        total: 0,
        totalPages: 1
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => stableSort(products.map(mapAdminProduct), getComparator(order, orderBy)), [order, orderBy, products]);

  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_, nextPage) => {
    const params = new URLSearchParams(searchParams);

    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleStatusChange = event => {
    const params = new URLSearchParams(searchParams);
    const nextStatus = event.target.value;

    params.delete("page");

    if (nextStatus === ALL_PRODUCT_STATUS) {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return <PageWrapper title="Product List">
      <SearchArea buttonText="Add Product" url="/admin/products/create" searchPlaceholder="Search Product..." extraContent={<TextField select size="small" label="Status" value={statusFilter} onChange={handleStatusChange} sx={{
      minWidth: 160
    }}>
            <MenuItem value={ALL_PRODUCT_STATUS}>All statuses</MenuItem>
            <MenuItem value={ACTIVE_STATUS}>Active</MenuItem>
            <MenuItem value={INACTIVE_STATUS}>Inactive</MenuItem>
          </TextField>} />

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
                    <td colSpan={5}>
                      <Stack alignItems="center" justifyContent="center" py={6}>
                        <CircularProgress color="info" />
                      </Stack>
                    </td>
                  </tr> : filteredProducts.length ? filteredProducts.map(product => <ProductRow key={product.id} product={product} onChanged={loadProducts} onDeleted={deletedId => {
                setProducts(current => current.filter(item => item.id !== deletedId));
                setPagination(current => ({
                  ...current,
                  total: Math.max(0, current.total - 1)
                }));
              }} />) : <tr>
                    <td colSpan={5}>
                      <Stack alignItems="center" justifyContent="center" py={6}>
                        <Typography color="text.secondary">No products found for the current filters.</Typography>
                      </Stack>
                    </td>
                  </tr>}
              </TableBody>
            </Table>
          </TableContainer>
        </OverlayScrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} page={pagination.page} count={Math.max(1, Number(pagination.totalPages || 1))} />
        </Stack>
      </Card>
    </PageWrapper>;
}