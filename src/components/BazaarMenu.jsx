import { Fragment, useCallback, useState } from "react";
import Menu from "@mui/material/Menu";


// ===============================================================


// ===============================================================

export default function BazaarMenu({
  open,
  sx,
  handler,
  options,
  direction = "left"
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleClick = useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  return <Fragment>
      {handler(handleClick)}

      <Menu sx={sx} elevation={1} anchorEl={anchorEl} onClose={handleClose} open={open !== undefined ? open : !!anchorEl} anchorOrigin={{
      vertical: "bottom",
      horizontal: direction
    }} transformOrigin={{
      vertical: "top",
      horizontal: direction
    }} slotProps={{
      paper: {
        sx: {
          mt: 1,
          boxShadow: 5,
          minWidth: 180,
          borderRadius: 2
        }
      }
    }}>
        {options(handleClose)}
      </Menu>
    </Fragment>;
}