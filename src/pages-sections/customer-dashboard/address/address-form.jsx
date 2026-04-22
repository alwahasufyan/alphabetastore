"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// MUI
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";

// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField } from "components/form-hook";
import { createMyAddress, updateMyAddress } from "utils/addresses";
import { formatLibyaPhone, isValidLibyaPhone, LIBYA_PHONE_PREFIX, LIBYAN_CITIES, stripLibyaPhonePrefix } from "utils/libya";

// CUSTOM DATA MODEL

const validationSchema = yup.object().shape({
  label: yup.string().trim().required("Label is required"),
  fullName: yup.string().trim().required("Full name is required"),
  phone: yup.string().required("Phone is required").test("libya-phone", "Enter a valid Libyan phone number", value => isValidLibyaPhone(value || "")),
  city: yup.string().oneOf(LIBYAN_CITIES, "Select a Libyan city").required("City is required"),
  addressLine: yup.string().trim().required("Address is required"),
  notes: yup.string().trim().optional(),
  isDefault: yup.boolean().default(false)
});


// =============================================================


// =============================================================

export default function AddressForm({
  address,
  addressId
}) {
  const router = useRouter();
  const initialValues = {
    label: address?.label || "",
    fullName: address?.fullName || "",
    phone: stripLibyaPhonePrefix(address?.phone || ""),
    city: address?.city || "",
    addressLine: address?.addressLine || "",
    notes: address?.notes || "",
    isDefault: Boolean(address?.isDefault)
  };
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });

  useEffect(() => {
    methods.reset(initialValues);
  }, [address?.id, addressId]);

  const {
    handleSubmit,
    register,
    formState: {
      isSubmitting
    }
  } = methods;

  const handleSubmitForm = handleSubmit(async values => {
    const payload = {
      label: values.label.trim(),
      fullName: values.fullName.trim(),
      phone: formatLibyaPhone(values.phone),
      city: values.city.trim(),
      addressLine: values.addressLine.trim(),
      notes: values.notes?.trim() || undefined,
      isDefault: Boolean(values.isDefault)
    };

    try {
      if (addressId === "new") {
        await createMyAddress(payload);
      } else {
        await updateMyAddress(addressId, payload);
      }

      router.push(`/address?updated=${Date.now()}`);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to save address.");
    }
  });

  return <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <Grid container spacing={3}>
        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <TextField fullWidth size="medium" name="label" label="Address Label" />
        </Grid>

        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <TextField fullWidth size="medium" name="fullName" label="Full Name" />
        </Grid>

        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <TextField fullWidth size="medium" label="Phone" name="phone" type="tel" helperText="The Libyan country code +218 is added automatically." slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">{LIBYA_PHONE_PREFIX}</InputAdornment>,
            inputProps: {
              inputMode: "numeric",
              maxLength: 9
            }
          }
        }} />
        </Grid>

        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <TextField select fullWidth size="medium" label="City" name="city">
            {LIBYAN_CITIES.map(city => <MenuItem key={city} value={city}>{city}</MenuItem>)}
          </TextField>
        </Grid>

        <Grid size={12}>
          <TextField fullWidth size="medium" name="addressLine" label="Address Line" />
        </Grid>

        <Grid size={12}>
          <TextField fullWidth multiline rows={4} size="medium" label="Notes (optional)" name="notes" />
        </Grid>

        <Grid size={12}>
          <FormControlLabel control={<Checkbox {...register("isDefault")} checked={methods.watch("isDefault")} />} label="Set as default address" />
        </Grid>

        <Grid size={12}>
          <Button size="large" type="submit" color="primary" variant="contained" loading={isSubmitting}>
            {addressId === "new" ? "Create Address" : "Save Changes"}
          </Button>
        </Grid>
      </Grid>
    </FormProvider>;
}