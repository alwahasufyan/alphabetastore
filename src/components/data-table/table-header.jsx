import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableCell from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";

// CUSTOM ICON COMPONENT
import UpDown from "icons/UpDown";


// STYLED COMPONENTS
const StyledTableCell = styled(TableCell)(() => ({
  fontWeight: 500,
  padding: "16px 20px"
}));


// ==============================================================


// ==============================================================

export default function TableHeader({
  order,
  heading,
  orderBy,
  onRequestSort
}) {
  return <TableHead sx={{
    backgroundColor: "grey.50"
  }}>
      <TableRow>
        {heading.map(headCell => <StyledTableCell key={headCell.id} align={headCell.align} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel active={orderBy === headCell.id} onClick={() => onRequestSort(headCell.id)} direction={orderBy === headCell.id ? order : "asc"} IconComponent={() => <UpDown sx={{
          fontSize: 12,
          ml: 1,
          color: "grey.400"
        }} />}>
              {headCell.label}
            </TableSortLabel>
          </StyledTableCell>)}
      </TableRow>
    </TableHead>;
}