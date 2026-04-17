import Link from "next/link";
import Image from "next/image";

// MUI
import Divider from "@mui/material/Divider";

// STYLED COMPONENTS
import { CardWrapper, CardContent, CardLink } from "./styles";


// ========================================================


// ========================================================

export default function BannerCard2({
  img,
  url,
  title,
  subTitle,
  contentPosition = "left",
  ...props
}) {
  return <CardWrapper {...props}>
      <Image fill alt="category" src={img} sizes="(100vw, 240px)" />

      <CardContent contentAlign={contentPosition} className="content">
        <h2 className="title">{title}</h2>
        <p>{subTitle}</p>
        <Divider className="divider" />

        <Link href={url}>
          <CardLink>Shop Now</CardLink>
        </Link>
      </CardContent>
    </CardWrapper>;
}