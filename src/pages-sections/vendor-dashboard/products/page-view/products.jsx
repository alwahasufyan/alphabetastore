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

//  LOCAL CUSTOM COMPONENT
import ProductRow from "../product-row";
import SearchArea from "../../search-box";
import PageWrapper from "../../page-wrapper";
import { fetchAdminProducts, mapAdminProduct } from "utils/admin-catalog";

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
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q")?.trim().toLowerCase() || "";
  const [products, setProducts] = useState(Array.isArray(initialProducts) ? initialProducts : []);
  const [isLoading, setIsLoading] = useState(!initialProducts?.length);
  const [pageError, setPageError] = useState("");

  const loadProducts = useCallback(async () => {
    setPageError("");

    try {
      const data = await fetchAdminProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => products.map(mapAdminProduct).filter(item => {
    if (!searchTerm) return true;

    return [item.name, item.slug, item.categoryName].some(value => value?.toLowerCase().includes(searchTerm));
  }), [products, searchTerm]);

  const {
    order,
    orderBy,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: filteredProducts
  });

  return <PageWrapper title="Product List">
      <SearchArea buttonText="Add Product" url="/admin/products/create" searchPlaceholder="Search Product..." />

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
                  </tr> : filteredList.map(product => <ProductRow key={product.id} product={product} onChanged={loadProducts} onDeleted={deletedId => {
                setProducts(current => current.filter(item => item.id !== deletedId));
              }} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </OverlayScrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} count={Math.ceil(filteredProducts.length / rowsPerPage)} />
        </Stack>
      </Card>
    </PageWrapper>;
}