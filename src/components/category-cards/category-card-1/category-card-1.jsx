import LazyImage from "components/LazyImage";
import { CategoryTitle, Wrapper } from "./styles";


// ============================================================


// ============================================================

export default function CategoryCard1({
  image,
  title
}) {
  return <Wrapper>
      <LazyImage src={image} width={213} height={213} alt="category" />

      <CategoryTitle className="category-title">
        <p>{title}</p>
      </CategoryTitle>
    </Wrapper>;
}