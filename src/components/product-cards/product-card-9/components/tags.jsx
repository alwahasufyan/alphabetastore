import Link from "next/link";

// STYLED COMPONENTS
import { TagRoot } from "../styles";


// ==============================================================


// ==============================================================

export default function ProductTags({
  tags
}) {
  return <TagRoot>
      {tags.map(item => <Link href="#" key={item}>
          <p>{item}</p>
        </Link>)}
    </TagRoot>;
}