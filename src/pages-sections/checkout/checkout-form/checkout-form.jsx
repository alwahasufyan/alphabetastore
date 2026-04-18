"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// MUI
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField } from "components/form-hook";

// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";

// API
import { apiPost } from "utils/api";

// STYLED COMPONENT
import { ButtonWrapper, CardRoot, FormWrapper } from "./styles";


const validationSchema = yup.object().shape({
  fullName: yup.string().trim().required("Full name is required"),
  phone: yup.string().trim().required("Phone number is required"),
  city: yup.string().trim().required("City is required"),
  address: yup.string().trim().required("Address is required"),
  notes: yup.string().trim().optional()
});

export default function CheckoutForm() {
  const router = useRouter();
  const {
    state,
    refreshCart,
    ready
  } = useCart();
  const [submitError, setSubmitError] = useState("");
  const cartItemsCount = state.cart.length;
  const initialValues = {
    fullName: "",
    phone: "",
    city: "",
    address: "",
    notes: ""
  };

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });

  const {
    handleSubmit,
    formState: {
      isSubmitting
    }
  } = methods;

  const handleSubmitForm = handleSubmit(async values => {
    if (cartItemsCount === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    setSubmitError("");

    try {
      const order = await apiPost("/orders", {
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        city: values.city.trim(),
        address: values.address.trim(),
        notes: values.notes?.trim() || undefined
      });

      await refreshCart();
      router.push(`/order-confirmation?orderId=${order.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to place order.");
    }
  });

  return <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <CardRoot elevation={0}>
        <Typography variant="h5" sx={{
        mb: 2
      }}>
          Checkout Details
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{
        mb: 3
      }}>
          Cash on delivery only. Fill in your contact details and delivery address to place the order.
        </Typography>

        {submitError ? <Alert severity="error" sx={{
        mb: 3
      }}>
            {submitError}
          </Alert> : null}

        <FormWrapper>
          <TextField size="medium" fullWidth label="Full Name" name="fullName" />
          <TextField size="medium" fullWidth label="Phone Number" name="phone" />
          <TextField size="medium" fullWidth label="City" name="city" />
          <TextField size="medium" fullWidth label="Address" name="address" />
          <TextField multiline rows={4} sx={{
          gridColumn: {
            sm: "1 / -1"
          }
        }} size="medium" fullWidth label="Notes (optional)" name="notes" />
        </FormWrapper>

        {!ready ? <Typography variant="body2" color="text.secondary" sx={{
        mt: 3
      }}>
            Loading cart...
          </Typography> : null}
      </CardRoot>

      <ButtonWrapper>
        <Button size="large" fullWidth href="/cart" color="primary" variant="outlined" LinkComponent={Link}>
          Back to Cart
        </Button>

        <Button size="large" fullWidth type="submit" color="primary" variant="contained" disabled={!ready || cartItemsCount === 0 || isSubmitting}>
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      </ButtonWrapper>
    </FormProvider>;
}