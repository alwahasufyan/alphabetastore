"use client";

import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import FlexRowCenter from "components/flex-box/flex-row-center";
import BoxLink from "./box-link";
export default function RegisterBottom() {
  const { t } = useTranslation();
  return <FlexRowCenter gap={1} mt={3}>
      <Typography variant="body2" color="text.secondary">
        {t("authAlreadyHaveAccount")}
      </Typography>

      <BoxLink title={t("Login")} href="/login" />
    </FlexRowCenter>;
}