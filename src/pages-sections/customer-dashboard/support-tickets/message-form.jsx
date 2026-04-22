"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// MUI
import Button from "@mui/material/Button";

// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField } from "components/form-hook";
const initialValues = {
  message: ""
};
const validationSchema = yup.object().shape({
  message: yup.string().required("Message is required")
});
export default function MessageForm({
  onSubmit,
  isSubmitting = false,
  submitLabel = "Post message"
}) {
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });
  const {
    handleSubmit,
    reset
  } = methods;
  const handleSubmitForm = handleSubmit(async values => {
    if (typeof onSubmit === "function") {
      await onSubmit(values.message);
      reset(initialValues);
    }
  });
  return <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <TextField rows={8} fullWidth multiline name="message" placeholder="Write your message here..." sx={{
      mb: 3
    }} />

      <Button size="large" disabled={isSubmitting} type="submit" color="primary" variant="contained">
        {isSubmitting ? "Sending..." : submitLabel}
      </Button>
    </FormProvider>;
}