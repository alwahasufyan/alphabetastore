"use client";

import { useParams } from "next/navigation";
import Typography from "@mui/material/Typography";
import clsx from "clsx";

// GLOBAL CUSTOM COMPONENTS
import IconComponent from "components/IconComponent";

// CUSTOM DATA MODEL


// ==============================================================


// ==============================================================

export default function ListItem({
  item
}) {
  const {
    title,
    href,
    icon
  } = item;
  const {
    category
  } = useParams();
  const active = href.endsWith(category);
  return <div className={clsx("list-item", {
    active
  })}>
      <IconComponent icon={icon} fontSize="small" color="inherit" />
      <Typography component="span" className="list-item-title">
        {title}
      </Typography>
    </div>;
}