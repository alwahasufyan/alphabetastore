"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// GLOBAL CUSTOM COMPONENTS
import { TextField, FormProvider } from "components/form-hook";
import { useAuth } from "contexts/AuthContext";
import { clearStoredCart, emitCartReset } from "utils/cart";
import { apiPost } from "utils/api";
import { saveTokens } from "utils/auth";

// LOCAL CUSTOM COMPONENTS
import Label from "../components/label";
import EyeToggleButton from "../components/eye-toggle-button";

// LOCAL CUSTOM HOOK
import usePasswordVisible from "../use-password-visible";


// LOGIN FORM FIELD VALIDATION SCHEMA
const validationSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
  email: yup.string().email("Invalid Email Address").required("Email is required")
});
export default function LoginPageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loadCurrentUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const {
    visiblePassword,
    togglePasswordVisible
  } = usePasswordVisible();
  const initialValues = {
    email: "",
    password: ""
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
    setErrorMessage("");

    try {
      const response = await apiPost("/auth/login", values);

      saveTokens(response.accessToken, response.refreshToken);
      clearStoredCart();
      emitCartReset();

      const currentUser = await loadCurrentUser();

      if (currentUser.role === "ADMIN") {
        router.push(searchParams.get("next") || "/vendor/dashboard");
        return;
      }

      router.push(searchParams.get("next") || "/profile");
    } catch (error) {
      setErrorMessage(error instanceof Error && error.message === "Invalid credentials." ? "Invalid credentials" : "Invalid credentials");
    }
  });
  return <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      {errorMessage ? <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert> : null}

      <div className="mb-1">
        <Label>Email or Phone Number</Label>
        <TextField fullWidth name="email" type="email" size="medium" placeholder="exmple@mail.com" />
      </div>

      <div className="mb-2">
        <Label>Password</Label>
        <TextField fullWidth size="medium" name="password" autoComplete="on" placeholder="*********" type={visiblePassword ? "text" : "password"} slotProps={{
        input: {
          endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
        }
      }} />
      </div>

      <Button fullWidth size="large" type="submit" color="primary" variant="contained" loading={isSubmitting}>
        Login
      </Button>
    </FormProvider>;
}