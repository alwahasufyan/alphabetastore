"use client";

import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import CircularProgress from "@mui/material/CircularProgress";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

// GLOBAL CUSTOM COMPONENTS
import OverlayScrollbar from "components/overlay-scrollbar";
import { TableHeader, TablePagination } from "components/data-table";

// GLOBAL CUSTOM HOOK
import useMuiTable from "hooks/useMuiTable";

// LOCAL CUSTOM COMPONENT
import CategoryRow from "../category-row";
import SearchArea from "../../search-box";
import PageWrapper from "../../page-wrapper";
import { fetchCategories } from "utils/catalog";

// CUSTOM DATA MODEL


// TABLE HEAD COLUMN DATA
import { tableHeading } from "../table-heading";


// =============================================================================


// =============================================================================

const CategoriesPageView = ({
  initialCategories = []
}) => {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q")?.trim().toLowerCase() || "";
  const [categories, setCategories] = useState(Array.isArray(initialCategories) ? initialCategories : []);
  const [isLoading, setIsLoading] = useState(!initialCategories?.length);
  const [pageError, setPageError] = useState("");

  const loadCategories = useCallback(async () => {
    setPageError("");

    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  
// RESHAPE THE PRODUCT LIST BASED TABLE HEAD CELL ID
  const filteredCategories = useMemo(() => categories.map(item => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    isActive: item.isActive,
    parentId: item.parentId,
    parentName: item.parent?.name || "-",
    level: item.parentId ? 1 : 0
  })).filter(item => {
    if (!searchTerm) return true;

    return [item.name, item.slug, item.parentName].some(value => value?.toLowerCase().includes(searchTerm));
  }), [categories, searchTerm]);
  const {
    order,
    orderBy,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: filteredCategories
  });

  return <PageWrapper title="Product Categories">
      <SearchArea buttonText="Add Category" url="/admin/categories/create" searchPlaceholder="Search Category..." />

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
                    <td colSpan={6}>
                      <Stack alignItems="center" justifyContent="center" py={6}>
                        <CircularProgress color="info" />
                      </Stack>
                    </td>
                  </tr> : filteredList.map(category => <CategoryRow key={category.id} category={category} onChanged={loadCategories} onDeleted={deletedId => {
                setCategories(current => current.filter(item => item.id !== deletedId));
              }} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </OverlayScrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} count={Math.ceil(filteredCategories.length / rowsPerPage)} />
        </Stack>
      </Card>
    </PageWrapper>;
};
export default CategoriesPageView;