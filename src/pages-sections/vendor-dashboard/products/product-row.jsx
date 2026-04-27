import Link from "next/link";
import { useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

// MUI ICON COMPONENTS
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";

// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";
import AppSwitch from "components/AppSwitch";
import { deleteAdminProduct, updateAdminProductStatus } from "utils/admin-catalog";

// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";

// STYLED COMPONENTS
import { StyledTableRow, CategoryWrapper, StyledTableCell, StyledIconButton } from "../styles";


// ========================================================================


// ========================================================================

export default function ProductRow({
  product,
  onChanged,
  onDeleted
}) {
  const {
    categoryName,
    name,
    price,
    image,
    id,
    isActive,
    status,
    slug
  } = product;
  const [productActive, setProductActive] = useState(Boolean(isActive));
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleActive = async () => {
    const nextValue = !productActive;

    setProductActive(nextValue);

    try {
      await updateAdminProductStatus(id, nextValue);
      onChanged?.();
    } catch (error) {
      setProductActive(!nextValue);
      window.alert(error instanceof Error ? error.message : "Failed to update product status");
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    const confirmed = window.confirm(`Delete product \"${name}\"?`);

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await deleteAdminProduct(id);
      onDeleted?.(id);
      onChanged?.();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1.5}>
          <Avatar variant="rounded">
            <Box component="img" src={image} alt={name} sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }} />
          </Avatar>

          <div>
            <Typography variant="h6">{name}</Typography>

            <Typography variant="body1" sx={{
            fontSize: 13,
            color: "grey.600"
          }}>
              #{String(id).split("-")[0]}
            </Typography>
          </div>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align="left">
        <CategoryWrapper>{categoryName}</CategoryWrapper>
      </StyledTableCell>

      <StyledTableCell align="left">{currency(price)}</StyledTableCell>

      <StyledTableCell align="left">
        <FlexBox alignItems="center" gap={1}>
          <AppSwitch color="info" checked={productActive} onChange={handleToggleActive} />

          <Typography variant="body2">{productActive ? "Active" : status || "Inactive"}</Typography>
        </FlexBox>
      </StyledTableCell>

      <StyledTableCell align="center">
        <Link href={`/admin/products/${slug}`}>
          <StyledIconButton>
            <Edit />
          </StyledIconButton>
        </Link>

        <StyledIconButton onClick={handleDelete} disabled={isDeleting}>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>;
}
