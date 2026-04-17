import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import debounce from "lodash/debounce";

// MUI
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";

// GLOBAL CUSTOM COMPONENTS
import SearchInput from "components/SearchInput";
import FlexBox from "components/flex-box/flex-box";


// ===============================================================


// ===============================================================

export default function SearchArea({
  url = "/",
  buttonText = "Add Product",
  searchPlaceholder = "Search Product..."
}) {
  const router = useRouter();
  const pathname = usePathname();
  const downSM = useMediaQuery(theme => theme.breakpoints.down("sm"));
  const handleSearch = debounce(value => {
    if (value) router.push(`?q=${value}`);else router.push(pathname);
  }, 100);
  return <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
      <SearchInput placeholder={searchPlaceholder} onChange={e => handleSearch(e.target.value)} />

      <Button href={url} color="info" fullWidth={downSM} variant="contained" startIcon={<Add />} LinkComponent={Link} sx={{
      minHeight: 44
    }}>
        {buttonText}
      </Button>
    </FlexBox>;
}