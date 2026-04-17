import Link from "next/link";
import Box from "@mui/material/Box";

// CUSTOM COMPONENTS
import ColumnList from "./column-list";
import LazyImage from "components/LazyImage";

// CUSTOM DATA MODEL


// =========================================================


// =========================================================

export default function MegaMenu1({
  banner,
  data
}) {
  return <ColumnList list={data} banner={banner}>
      {banner?.position === "bottom" ? <Link href={banner.href}>
          <Box position="relative" height={150} width="100%">
            <LazyImage fill alt="banner" src={banner.url} sizes="(max-width: 768px) 100vw, 100vw" sx={{
          objectFit: "cover",
          objectPosition: "center center"
        }} />
          </Box>
        </Link> : null}
    </ColumnList>;
}