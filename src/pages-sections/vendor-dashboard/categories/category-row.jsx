"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";

// MUI ICON COMPONENTS
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";

// GLOBAL CUSTOM COMPONENT
import BazaarSwitch from "components/BazaarSwitch";
import { apiDelete, apiPatch } from "utils/api";

// STYLED COMPONENTS
import { StyledTableRow, CategoryWrapper, StyledTableCell, StyledIconButton } from "../styles";


// ========================================================================


// ========================================================================

export default function CategoryRow({
  category,
  onChanged,
  onDeleted
}) {
  const {
    name,
    level,
    isActive,
    id,
    slug,
    parentName
  } = category;
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(Boolean(isActive));
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleActive = async () => {
    const nextValue = !activeCategory;

    setActiveCategory(nextValue);

    try {
      await apiPatch(`/categories/${id}`, {
        isActive: nextValue
      });

      onChanged?.();
      router.refresh();
    } catch (error) {
      setActiveCategory(!nextValue);
      window.alert(error instanceof Error ? error.message : "Failed to update category");
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    const confirmed = window.confirm(`Delete category \"${name}\"?`);

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await apiDelete(`/categories/${id}`);

      onDeleted?.(id);
      onChanged?.();
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to delete category");
    } finally {
      setIsDeleting(false);
    }
  };

  return <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">#{id.split("-")[0]}</StyledTableCell>

      <StyledTableCell align="left">
        <CategoryWrapper>{name}</CategoryWrapper>
      </StyledTableCell>

      <StyledTableCell align="left">
        <Avatar variant="rounded">{name?.charAt(0)?.toUpperCase() || "C"}
        </Avatar>
      </StyledTableCell>

      <StyledTableCell align="left">{level ? parentName : "Root"}</StyledTableCell>

      <StyledTableCell align="left">
        <BazaarSwitch color="info" checked={activeCategory} onChange={handleToggleActive} />
      </StyledTableCell>

      <StyledTableCell align="center">
        <Link href={`/admin/categories/${slug}`}>
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