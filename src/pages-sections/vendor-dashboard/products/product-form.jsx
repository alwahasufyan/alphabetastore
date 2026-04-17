"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// MUI
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import { FormProvider, TextField } from "components/form-hook";
import {
  ACTIVE_STATUS,
  INACTIVE_STATUS,
  createAdminProduct,
  fetchAdminCategories,
  fetchAdminProductBySlug,
  parseImageUrls,
  serializeImageUrls,
  updateAdminProduct
} from "utils/admin-catalog";


// FORM FIELDS VALIDATION SCHEMA
const validationSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  slug: yup.string().trim().optional(),
  categoryId: yup.string().required("Category is required"),
  shortDescription: yup.string().trim().required("Short description is required"),
  description: yup.string().trim().required("Description is required"),
  stockQty: yup.number().transform((value, originalValue) => originalValue === "" ? NaN : value).typeError("Stock quantity must be a number").integer("Stock quantity must be an integer").min(0, "Stock quantity cannot be negative").required("Stock quantity is required"),
  price: yup.number().transform((value, originalValue) => originalValue === "" ? NaN : value).typeError("Price must be a number").min(0, "Price cannot be negative").required("Price is required"),
  status: yup.string().oneOf([ACTIVE_STATUS, INACTIVE_STATUS]).required("Status is required"),
  imageUrlsText: yup.string().optional()
});


// ================================================================


// ================================================================

export default function ProductForm(props) {
  const {
    slug
  } = props;
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const initialValues = {
    name: "",
    slug: "",
    categoryId: "",
    shortDescription: "",
    description: "",
    stockQty: "",
    price: "",
    status: ACTIVE_STATUS,
    imageUrlsText: ""
  };
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });
  const {
    handleSubmit,
    reset,
    formState: {
      isSubmitting
    }
  } = methods;
  const categoryOptions = useMemo(() => [...categories].sort((left, right) => left.name.localeCompare(right.name)), [categories]);

  useEffect(() => {
    let isMounted = true;

    const loadForm = async () => {
      setPageError("");
      setIsLoading(true);

      try {
        const [categoryData, productData] = await Promise.all([fetchAdminCategories(), slug ? fetchAdminProductBySlug(slug) : Promise.resolve(null)]);

        if (!isMounted) return;

        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setProduct(productData);

        if (productData) {
          reset({
            name: productData.name || "",
            slug: productData.slug || "",
            categoryId: productData.categoryId || productData.category?.id || "",
            shortDescription: productData.shortDescription || "",
            description: productData.description || "",
            stockQty: String(productData.stockQty ?? ""),
            price: String(productData.price ?? ""),
            status: productData.status || ACTIVE_STATUS,
            imageUrlsText: serializeImageUrls(productData.images)
          });
        } else {
          reset(initialValues);
        }
      } catch (error) {
        if (!isMounted) return;
        setPageError(error instanceof Error ? error.message : "Failed to load product form");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadForm();

    return () => {
      isMounted = false;
    };
  }, [initialValues.categoryId, initialValues.description, initialValues.imageUrlsText, initialValues.name, initialValues.price, initialValues.shortDescription, initialValues.slug, initialValues.status, initialValues.stockQty, reset, slug]);

// FORM SUBMIT HANDLER
  const handleSubmitForm = handleSubmit(async values => {
    const imageUrls = parseImageUrls(values.imageUrlsText);
    const payload = {
      categoryId: values.categoryId,
      name: values.name.trim(),
      description: values.description.trim(),
      shortDescription: values.shortDescription.trim(),
      price: Number(values.price),
      stockQty: Number(values.stockQty),
      status: values.status,
      ...(values.slug?.trim() ? {
        slug: values.slug.trim()
      } : {}),
      ...(imageUrls.length ? {
        imageUrls
      } : {})
    };

    setPageError("");

    try {
      if (product?.id) {
        await updateAdminProduct(product.id, payload);
      } else {
        await createAdminProduct(payload);
      }

      router.replace(`/admin/products?updated=${Date.now()}`);
      router.refresh();
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to save product");
    }
  });

  if (isLoading) {
    return <Card className="p-3" sx={{
      display: "flex",
      justifyContent: "center",
      py: 6
    }}>
        <CircularProgress color="info" />
      </Card>;
  }

  return <Card className="p-3">
      <FormProvider methods={methods} onSubmit={handleSubmitForm}>
        <Grid container spacing={3}>
          {pageError ? <Grid size={12}>
              <Alert severity="error">{pageError}</Alert>
            </Grid> : null}

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField fullWidth name="name" label="Name" color="info" size="medium" placeholder="Name" />
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField fullWidth name="slug" label="Slug" color="info" size="medium" placeholder="product-slug" helperText="Optional. Leave blank on create to generate automatically." />
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField select fullWidth color="info" size="medium" name="categoryId" placeholder="Category" label="Select Category">
              {categoryOptions.map(option => <MenuItem key={option.id} value={option.id}>{option.parent?.name ? `${option.parent.name} / ${option.name}` : option.name}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField select fullWidth color="info" size="medium" name="status" placeholder="Status" label="Status">
              <MenuItem value={ACTIVE_STATUS}>Active</MenuItem>
              <MenuItem value={INACTIVE_STATUS}>Inactive</MenuItem>
            </TextField>
          </Grid>

          <Grid size={12}>
            <TextField fullWidth name="shortDescription" color="info" size="medium" label="Short Description" placeholder="Short Description" />
          </Grid>

          <Grid size={12}>
            <TextField rows={6} multiline fullWidth color="info" size="medium" name="description" label="Description" placeholder="Description" />
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField fullWidth name="stockQty" color="info" size="medium" type="number" label="Stock Quantity" placeholder="Stock Quantity" />
          </Grid>

          <Grid size={{
          sm: 6,
          xs: 12
        }}>
            <TextField fullWidth name="price" color="info" size="medium" type="number" label="Price" placeholder="Price" />
          </Grid>

          <Grid size={12}>
            <TextField rows={4} multiline fullWidth color="info" size="medium" name="imageUrlsText" label="Image URLs" placeholder="One image URL per line" helperText="Direct file upload is disabled for now. Enter one image URL per line." />
          </Grid>

          <Grid size={12}>
            <Button variant="outlined" color="inherit" onClick={() => router.push("/admin/products")} sx={{
            mr: 2
          }}>
              Cancel
            </Button>

            <Button loading={isSubmitting} variant="contained" color="info" type="submit">
              {product?.id ? "Update product" : "Save product"}
            </Button>
          </Grid>
        </Grid>
      </FormProvider>
    </Card>;
}