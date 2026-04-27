"use client";

import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";


// STYLED COMPONENT
const StyledRoot = styled("div")(() => ({
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .MuiCard-root": {
    textAlign: "center",
    padding: "2rem"
  },
  "& .MuiTypography-root": {
    marginBottom: "1rem"
  }
}));


// ==============================================================


// ==============================================================

export default function Error({
  error,
  reset
}) {
  const {
    t
  } = useTranslation();
  const message = error?.message || t("genericError");
  const normalizedMessage = /server unavailable/i.test(message) ? t("serverUnavailable") : message;

  return <StyledRoot>
      <Card>
        <Typography variant="h1">{t("somethingWentWrong")}</Typography>
        <Typography variant="body1" color="text.secondary">
          {normalizedMessage}
        </Typography>
        <Button color="error" variant="contained" onClick={() => reset()}>
          {t("retry")}
        </Button>
      </Card>
    </StyledRoot>;
}