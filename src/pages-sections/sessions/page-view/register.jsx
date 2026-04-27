"use client";

import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { apiGet, apiPost } from "utils/api";

// GLOBAL CUSTOM COMPONENTS
import { Checkbox, TextField, FormProvider } from "components/form-hook";

// LOCAL CUSTOM COMPONENTS
import EyeToggleButton from "../components/eye-toggle-button";

// LOCAL CUSTOM HOOK
import Label from "../components/label";
import usePasswordVisible from "../use-password-visible";

// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";

const DEFAULT_TERMS_TEXT = "باستخدامك لهذه المنصة وتسجيل حساب جديد، فأنت توافق على الالتزام بشروط الاستخدام وسياسات المتجر.";
const DEFAULT_PRIVACY_TEXT = "نقوم بجمع البيانات الأساسية اللازمة لتقديم الخدمة ومعالجة الطلبات، مع الحفاظ على خصوصية بياناتك وعدم مشاركتها خارج نطاق التشغيل القانوني.";

// REGISTER FORM FIELD VALIDATION SCHEMA
const validationSchema = yup.object().shape({
  name: yup.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name is too long").required("Name is required"),
  email: yup.string().trim().email("Invalid Email Address").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").max(72, "Password is too long").required("Password is required"),
  re_password: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Please re-type password"),
  acceptedPolicies: yup.bool().test("acceptedPolicies", "You have to agree to the Terms and Privacy Policy.", value => value === true).required("You have to agree to the Terms and Privacy Policy.")
});
export default function RegisterPageView() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [termsText, setTermsText] = useState(DEFAULT_TERMS_TEXT);
  const [privacyText, setPrivacyText] = useState(DEFAULT_PRIVACY_TEXT);
  const [openPolicyDialog, setOpenPolicyDialog] = useState(null);
  const {
    visiblePassword,
    togglePasswordVisible
  } = usePasswordVisible();
  const inputProps = {
    endAdornment: <EyeToggleButton show={visiblePassword} click={togglePasswordVisible} />
  };
  const initialValues = {
    name: "",
    email: "",
    password: "",
    re_password: "",
    acceptedPolicies: false
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

  useEffect(() => {
    const loadPolicySettings = async () => {
      try {
        const settings = await apiGet("/settings");

        setTermsText(String(settings?.terms_and_conditions_text || DEFAULT_TERMS_TEXT));
        setPrivacyText(String(settings?.privacy_policy_text || DEFAULT_PRIVACY_TEXT));
      } catch {
        // Keep local defaults if settings are unavailable.
      }
    };

    loadPolicySettings();
  }, []);

  const activePolicy = useMemo(() => {
    if (openPolicyDialog === "terms") {
      return {
        title: "اتفاقية الاستخدام",
        text: termsText
      };
    }

    if (openPolicyDialog === "privacy") {
      return {
        title: "سياسة الخصوصية",
        text: privacyText
      };
    }

    return null;
  }, [openPolicyDialog, termsText, privacyText]);

  const openPolicy = type => event => {
    event.preventDefault();
    event.stopPropagation();
    setOpenPolicyDialog(type);
  };

  const handleSubmitForm = handleSubmit(async values => {
    setErrorMessage("");

    try {
      await apiPost("/auth/register", {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        acceptedPolicies: values.acceptedPolicies
      });
      router.push("/login");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create account.");
    }
  });
  return <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      {errorMessage ? <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert> : null}

      <div className="mb-1">
        <Label>الاسم الكامل</Label>
        <TextField fullWidth name="name" size="medium" placeholder="الاسم الكامل" />
      </div>

      <div className="mb-1">
        <Label>البريد الإلكتروني</Label>
        <TextField fullWidth name="email" size="medium" type="email" placeholder="you@example.com" />
      </div>

      <div className="mb-1">
        <Label>كلمة المرور</Label>
        <TextField fullWidth size="medium" name="password" placeholder="*********" type={visiblePassword ? "text" : "password"} slotProps={{
        input: inputProps
      }} />
      </div>

      <div className="mb-1">
        <Label>تأكيد كلمة المرور</Label>
        <TextField fullWidth size="medium" name="re_password" placeholder="*********" type={visiblePassword ? "text" : "password"} slotProps={{
        input: inputProps
      }} />
      </div>

      <div className="agreement">
        <Checkbox name="acceptedPolicies" size="small" color="secondary" label={<FlexBox flexWrap="wrap" alignItems="center" justifyContent="flex-start" gap={1}>
                <Box display={{
          sm: "inline-block",
          xs: "none"
              }}>بإنشاء الحساب أنت توافق على</Box>
              <Box display={{
          sm: "none",
          xs: "inline-block"
              }}>الموافقة على</Box>
                <Button onClick={openPolicy("terms")} sx={{
          p: 0,
          minWidth: "auto",
          fontWeight: 600,
          textDecoration: "underline"
        }}>
                  اتفاقية الاستخدام
                </Button>
                <Box>و</Box>
                <Button onClick={openPolicy("privacy")} sx={{
          p: 0,
          minWidth: "auto",
          fontWeight: 600,
          textDecoration: "underline"
        }}>
                  سياسة الخصوصية
                </Button>
            </FlexBox>} />
      </div>

      <Button fullWidth size="large" type="submit" color="primary" variant="contained" loading={isSubmitting}>
              إنشاء حساب
      </Button>

      <Dialog open={Boolean(activePolicy)} onClose={() => setOpenPolicyDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{activePolicy?.title}</DialogTitle>

        <DialogContent>
          <Typography sx={{ whiteSpace: "pre-line" }}>{activePolicy?.text}</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenPolicyDialog(null)}>إغلاق</Button>
        </DialogActions>
      </Dialog>
    </FormProvider>;
}