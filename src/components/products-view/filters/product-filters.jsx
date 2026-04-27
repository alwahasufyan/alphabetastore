"use client";

import { Fragment } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// MUI
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";

// GLOBAL CUSTOM COMPONENTS
import AccordionHeader from "components/accordion";

// CUSTOM LOCAL HOOK
import useProductFilterCard from "./use-product-filter-card";

// TYPES

export default function ProductFilters({
  filters
}) {
  const {
    categories: CATEGORIES
  } = filters;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const {
    collapsed,
    setCollapsed,
    handleChangeSearchParams
  } = useProductFilterCard();

  const handleSelectCategory = slug => {
    handleChangeSearchParams("category", selectedCategory === slug ? "" : slug);
  };

  const renderCategoryItem = item => {
    const title = typeof item === "string" ? item : item?.title;
    const slug = typeof item === "string" ? item : item?.slug;
    const isSelected = Boolean(slug) && selectedCategory === slug;

    return <Typography variant="body1" key={slug || title} onClick={slug ? () => handleSelectCategory(slug) : undefined} sx={{
      py: 0.75,
      fontSize: 14,
      cursor: slug ? "pointer" : "default",
      color: isSelected ? "primary.main" : "grey.600",
      fontWeight: isSelected ? 600 : 400
    }}>
        {title}
      </Typography>;
  };

  const handleClearFilters = () => {
    router.push(pathname);
  };

  return <div>
      <Typography variant="h6" sx={{
      mb: 1.25
    }}>
        الفئات
      </Typography>

      {CATEGORIES.map(item => item.children ? <Fragment key={item.slug || item.title}>
            <AccordionHeader open={collapsed} onClick={() => setCollapsed(state => !state)} sx={{
        padding: ".5rem 0",
        cursor: "pointer",
        color: "grey.600"
      }}>
              <Typography component="span" onClick={event => {
          event.stopPropagation();
          if (item.slug) {
            handleSelectCategory(item.slug);
          }
        }} sx={{
          color: selectedCategory === item.slug ? "primary.main" : "inherit",
          fontWeight: selectedCategory === item.slug ? 600 : 400
        }}>{item.title}</Typography>
            </AccordionHeader>

            <Collapse in={collapsed}>
              {item.children.map(child => <Box key={(typeof child === "string" ? child : child?.slug) || (typeof child === "string" ? child : child?.title)} pl="22px">
                  {renderCategoryItem(child)}
                </Box>)}
            </Collapse>
          </Fragment> : renderCategoryItem(item))}

      {searchParams.size > 0 && <Button fullWidth disableElevation color="error" variant="contained" onClick={handleClearFilters} sx={{
      mt: 4
    }}>
          مسح الفلاتر
        </Button>}
    </div>;
}