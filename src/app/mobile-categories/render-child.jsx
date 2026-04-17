import Link from "next/link";

// LOCAL CUSTOM COMPONENTS
import NavAccordion from "./nav-accordion";

// CUSTOM DATA MODEL

export default function renderChild(categories) {
  return categories.map((item, i) => {
    if (item.children) return <NavAccordion item={item} key={i} />;
    return <Link href="#" key={i} className="link">
        {item.title}
      </Link>;
  });
}