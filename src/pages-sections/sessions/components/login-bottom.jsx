"use client";

import { Fragment } from "react";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { FlexBox, FlexRowCenter } from "components/flex-box";
import BoxLink from "./box-link";
export default function LoginBottom() {
  const { t } = useTranslation();
  return <Fragment>
      <FlexRowCenter gap={1} my={3}>
        <Typography variant="body2" color="text.secondary">
          {t("authDontHaveAccount")}
        </Typography>

        <BoxLink title={t("Register")} href="/register" />
      </FlexRowCenter>

      <FlexBox gap={1} py={2} borderRadius={1} justifyContent="center" bgcolor="grey.50">
        <Typography variant="body2" color="text.secondary">
          {t("authForgotPassword")}
        </Typography>

        <BoxLink title={t("authResetPassword")} href="/reset-password" />
      </FlexBox>
    </Fragment>;
}