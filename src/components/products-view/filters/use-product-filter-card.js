import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";
export default function useProductFilterCard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = useState(true);
  const [prices, setPrices] = useState(JSON.parse(searchParams.get("prices") || "[0, 300]"));
  const rating = useMemo(() => JSON.parse(searchParams.get("rating") || "0"), [searchParams]);
  const colors = useMemo(() => JSON.parse(searchParams.get("colors") || "[]"), [searchParams]);
  const sales = useMemo(() => JSON.parse(searchParams.get("sales") || "[]"), [searchParams]);
  const brands = useMemo(() => JSON.parse(searchParams.get("brands") || "[]"), [searchParams]);
  const handleChangeSearchParams = useCallback((key, value) => {
    if (!key || !value) return;
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false
    });
  }, [router, pathname, searchParams]);
  const debouncedChangePrice = debounce(values => {
    handleChangeSearchParams("prices", JSON.stringify(values));
  }, 500);
  const handleChangePrice = useCallback(values => {
    setPrices(values);
    debouncedChangePrice(values);
  }, [debouncedChangePrice]);
  const handleChangeColor = value => {
    const values = colors.includes(value) ? colors.filter(item => item !== value) : [...colors, value];
    handleChangeSearchParams("colors", JSON.stringify(values));
  };
  const handleChangeBrand = value => {
    const values = brands.includes(value) ? brands.filter(item => item !== value) : [...brands, value];
    handleChangeSearchParams("brands", JSON.stringify(values));
  };
  const handleChangeSales = value => {
    const values = sales.includes(value) ? sales.filter(item => item !== value) : [...sales, value];
    handleChangeSearchParams("sales", JSON.stringify(values));
  };
  return {
    sales,
    brands,
    rating,
    colors,
    prices,
    collapsed,
    setCollapsed,
    handleChangePrice,
    handleChangeColor,
    handleChangeBrand,
    handleChangeSales,
    handleChangeSearchParams
  };
}