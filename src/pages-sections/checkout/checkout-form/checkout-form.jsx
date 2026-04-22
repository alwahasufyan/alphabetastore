"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// MUI
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField } from "components/form-hook";

// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";
import { useAuth } from "contexts/AuthContext";
import { formatLibyaPhone, isValidLibyaPhone, LIBYA_PHONE_PREFIX, LIBYAN_CITIES, stripLibyaPhonePrefix } from "utils/libya";
import { createOrderPayment, fetchPaymentMethods } from "utils/payments";

// API
import { apiPost } from "utils/api";
import { fetchMyAddresses } from "utils/addresses";

// STYLED COMPONENT
import { ButtonWrapper, CardRoot, FormWrapper } from "./styles";


const validationSchema = yup.object().shape({
  fullName: yup.string().trim().required("Full name is required"),
  phone: yup.string().required("Phone number is required").test("libya-phone", "Enter a valid Libyan phone number", value => isValidLibyaPhone(value || "")),
  city: yup.string().oneOf(LIBYAN_CITIES, "Select a Libyan city").required("City is required"),
  address: yup.string().trim().required("Address is required"),
  notes: yup.string().trim().optional()
});

export default function CheckoutForm() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const {
    state,
    refreshCart,
    ready
  } = useCart();
  const [submitError, setSubmitError] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);
  const [paymentMethodsError, setPaymentMethodsError] = useState("");
  const [selectedPaymentCode, setSelectedPaymentCode] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("manual");
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
    reset,
    formState: {
      isSubmitting
    }
  } = methods;

  useEffect(() => {
    let active = true;

    const loadPaymentMethods = async () => {
      setPaymentMethodsLoading(true);
      setPaymentMethodsError("");

      try {
        const nextMethods = await fetchPaymentMethods();

        if (!active) {
          return;
        }

        setPaymentMethods(nextMethods);
        setSelectedPaymentCode(current => current || nextMethods[0]?.code || "");
      } catch (error) {
        if (active) {
          setPaymentMethods([]);
          setPaymentMethodsError(error instanceof Error ? error.message : "Failed to load payment methods.");
        }
      } finally {
        if (active) {
          setPaymentMethodsLoading(false);
        }
      }
    };

    loadPaymentMethods();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (!isAuthenticated) {
      setAddresses([]);
      setSelectedAddressId("manual");
      return () => {
        active = false;
      };
    }

    const loadAddresses = async () => {
      setAddressesLoading(true);

      try {
        const nextAddresses = await fetchMyAddresses();
        if (!active) return;

        setAddresses(nextAddresses);

        const nextDefaultAddress = nextAddresses.find(item => item.isDefault) || nextAddresses[0] || null;

        if (nextDefaultAddress) {
          setSelectedAddressId(nextDefaultAddress.id);
          reset({
            fullName: nextDefaultAddress.fullName || "",
            phone: stripLibyaPhonePrefix(nextDefaultAddress.phone || ""),
            city: nextDefaultAddress.city || "",
            address: nextDefaultAddress.addressLine || "",
            notes: nextDefaultAddress.notes || ""
          });
        }
      } catch {
        if (active) {
          setAddresses([]);
        }
      } finally {
        if (active) {
          setAddressesLoading(false);
        }
      }
    };

    loadAddresses();

    return () => {
      active = false;
    };
  }, [isAuthenticated, reset]);

  const handleSelectAddress = event => {
    const nextAddressId = event.target.value;
    setSelectedAddressId(nextAddressId);

    if (nextAddressId === "manual") {
      return;
    }

    const selectedAddress = addresses.find(item => item.id === nextAddressId);

    if (!selectedAddress) {
      return;
    }

    reset({
      fullName: selectedAddress.fullName || "",
      phone: stripLibyaPhonePrefix(selectedAddress.phone || ""),
      city: selectedAddress.city || "",
      address: selectedAddress.addressLine || "",
      notes: selectedAddress.notes || ""
    });
  };

  const handleSubmitForm = handleSubmit(async values => {
    if (cartItemsCount === 0) {
      setSubmitError("Your cart is empty.");
      return;
    }

    if (!selectedPaymentCode) {
      setSubmitError("Select a payment method before placing your order.");
      return;
    }

    setSubmitError("");

    try {
      const order = await apiPost("/orders", {
        ...(isAuthenticated && selectedAddressId !== "manual" ? {
          addressId: selectedAddressId
        } : {}),
        fullName: values.fullName.trim(),
        phone: formatLibyaPhone(values.phone),
        city: values.city.trim(),
        address: values.address.trim(),
        notes: values.notes?.trim() || undefined
      });

      const payment = await createOrderPayment(order.id, selectedPaymentCode);

      await refreshCart();

      const nextParams = new URLSearchParams({
        orderId: order.id,
        paymentId: payment.id,
        paymentMethod: payment.paymentMethodCode
      });

      router.push(`/order-confirmation?${nextParams.toString()}`);
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
          Choose a payment method, then fill in your contact details and delivery address to place the order.
        </Typography>

        {submitError ? <Alert severity="error" sx={{
        mb: 3
      }}>
            {submitError}
          </Alert> : null}

        {paymentMethodsError ? <Alert severity="error" sx={{
        mb: 3
      }}>
            {paymentMethodsError}
          </Alert> : null}

        <TextField select fullWidth size="medium" label="Payment Method" value={selectedPaymentCode} onChange={event => setSelectedPaymentCode(event.target.value)} disabled={paymentMethodsLoading || !paymentMethods.length} sx={{
        mb: 3
      }}>
          {paymentMethods.map(method => <MenuItem key={method.id} value={method.code}>{method.name}</MenuItem>)}
        </TextField>

        <Typography variant="body2" color="text.secondary" sx={{
        mb: 3
      }}>
          {selectedPaymentCode === "BANK_TRANSFER" ? "After placing the order, you will upload your bank transfer receipt for admin review." : "Cash on Delivery orders are approved immediately and moved to confirmed status."}
        </Typography>

        {isAuthenticated ? <>
            <TextField select fullWidth size="medium" label="Saved Address" value={selectedAddressId} onChange={handleSelectAddress} disabled={addressesLoading} sx={{
          mb: 3
        }}>
              <MenuItem value="manual">Enter address manually</MenuItem>
              {addresses.map(address => <MenuItem value={address.id} key={address.id}>
                  {address.label}{address.isDefault ? " (Default)" : ""}
                </MenuItem>)}
            </TextField>

            <Typography variant="body2" color="text.secondary" sx={{
          mb: 3
        }}>
              {addresses.length ? "Select a saved address to prefill the form, or switch to manual entry." : "No saved addresses found yet. You can manage them from your address dashboard."}
              {" "}
              <Link href="/address">Manage addresses</Link>
            </Typography>
          </> : null}

        <FormWrapper>
          <TextField size="medium" fullWidth label="Full Name" name="fullName" />
          <TextField size="medium" fullWidth label="Phone Number" name="phone" type="tel" helperText="The Libyan country code +218 is added automatically." slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">{LIBYA_PHONE_PREFIX}</InputAdornment>,
            inputProps: {
              inputMode: "numeric",
              maxLength: 9
            }
          }
        }} />
          <TextField select size="medium" fullWidth label="City" name="city">
            {LIBYAN_CITIES.map(city => <MenuItem key={city} value={city}>{city}</MenuItem>)}
          </TextField>
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

        {addressesLoading ? <Typography variant="body2" color="text.secondary" sx={{
        mt: 2
      }}>
            Loading saved addresses...
          </Typography> : null}

        {paymentMethodsLoading ? <Typography variant="body2" color="text.secondary" sx={{
        mt: 2
      }}>
            Loading payment methods...
          </Typography> : null}
      </CardRoot>

      <ButtonWrapper>
        <Button size="large" fullWidth href="/cart" color="primary" variant="outlined" LinkComponent={Link}>
          Back to Cart
        </Button>

        <Button size="large" fullWidth type="submit" color="primary" variant="contained" disabled={!ready || cartItemsCount === 0 || isSubmitting || paymentMethodsLoading || !selectedPaymentCode}>
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </Button>
      </ButtonWrapper>
    </FormProvider>;
}