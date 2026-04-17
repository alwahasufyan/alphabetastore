"use client";

import { useCallback } from "react";
import IconButton from "@mui/material/IconButton";
import Trash from "icons/Trash";
export default function DeleteAddressBtn({
  id
}) {
  const handleAddressDelete = useCallback(e => {
    e.stopPropagation();
    alert(id);
  }, [id]);
  return <IconButton onClick={handleAddressDelete}>
      <Trash fontSize="small" color="error" />
    </IconButton>;
}