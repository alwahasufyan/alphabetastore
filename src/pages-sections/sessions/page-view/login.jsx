"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// GLOBAL CUSTOM COMPONENTS
import { TextField, FormProvider } from "components/form-hook";
import { useAuth } from "contexts/AuthContext";
import { clearCartSession, emitCartReset } from "utils/cart";
import { apiPost } from "utils/api";
import { saveTokens } from "utils/auth";

// LOCAL CUSTOM COMPONENTS
import Label from "../components/label";
import EyeToggleButton from "../components/eye-toggle-button";

// LOCAL CUSTOM HOOK
import usePasswordVisible from "../use-password-visible";


// LOGIN FORM FIELD VALIDATION SCHEMA
export default function LoginPageView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loadCurrentUser } = useAuth();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState("");
  const {
    visiblePassword,
    togglePasswordVisible
  } = usePasswordVisible();
  const initialValues = {
    email: "",
    password: ""
  };
  const validationSchema = yup.object().shape({
    password: yup.string().min(8, t("validationPasswordMin")).max(72, t("validationPasswordMax")).required(t("validationPasswordRequired")),
    email: yup.string().trim().email(t("validationEmailInvalid")).required(t("validationEmailRequired"))
  });
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
      const response = await apiPost("/auth/login", {
        email: values.email.trim().toLowerCase(),
        password: values.password
      });

      saveTokens(response.accessToken, response.refreshToken);
      clearCartSession();
      emitCartReset();

      const currentUser = await loadCurrentUser();

      if (currentUser.role === "ADMIN") {
        router.push(searchParams.get("next") || "/vendor/dashboard");
        return;
      }

      router.push(searchParams.get("next") || "/profile");
    } catch (error) {
      setErrorMessage(error instanceof Error && error.message === "Invalid credentials." ? t("authInvalidCredentials") : t("authInvalidCredentials"));
    }
  });
  return <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      {errorMessage ? <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert> : null}

      <div className="mb-1">
        <Label>{t("authEmailLabel")}</Label>
        <TextField fullWidth name="email" type="email" size="medium" placeholder={t("authEmailPlaceholder")} />
      </div>

      <div className="mb-2">
        <Label>{t("authPasswordLabel")}</Label>
        <TextField fullWidth size="medium" name="password" autoComplete="on" placeholder={t("authPasswordPlaceholder")} type={visiblePassword ? "text" : "password"} slotProps={{
        input: {
          endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
        }
      }} />
      </div>

      <Button fullWidth size="large" type="submit" color="primary" variant="contained" loading={isSubmitting}>
        {t("authLoginAction")}
      </Button>
    </FormProvider>;
}