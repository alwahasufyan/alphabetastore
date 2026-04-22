import Link from "next/link";

// MUI
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

// CUSTOM COMPONENTS
import Pencil from "icons/Pencil";
import TableRow from "../table-row";
import DeleteAddressBtn from "./delete-btn";

// CUSTOM DATA MODEL


// ==============================================================


// ==============================================================

export default function AddressListItem({
  address,
  onDeleted
}) {
  return <Link href={`/address/${address.id}`}>
      <TableRow elevation={0}>
        <Typography noWrap fontWeight={500} variant="body1">
          {address.label}
        </Typography>

        <Typography noWrap variant="body1">
          {address.displayAddress}
        </Typography>

        <Typography noWrap variant="body1">
          {address.phone}
        </Typography>

        <Typography noWrap variant="body1" color="text.secondary" textAlign="right">
          <IconButton>
            <Pencil fontSize="small" color="inherit" />
          </IconButton>

          <DeleteAddressBtn id={address.id} onDeleted={onDeleted} />
        </Typography>
      </TableRow>
    </Link>;
}