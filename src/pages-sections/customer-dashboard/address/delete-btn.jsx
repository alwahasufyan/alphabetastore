"use client";

import { useCallback } from "react";
import IconButton from "@mui/material/IconButton";
import Trash from "icons/Trash";
import { deleteMyAddress } from "utils/addresses";

export default function DeleteAddressBtn({
  id,
  onDeleted
}) {
  const handleAddressDelete = useCallback(async e => {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = window.confirm("Delete this address?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteMyAddress(id);
      onDeleted?.(id);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to delete address.");
    }
  }, [id, onDeleted]);

  return <IconButton onClick={handleAddressDelete}>
      <Trash fontSize="small" color="error" />
    </IconButton>;
}