import { Fragment } from "react";
import Typography from "@mui/material/Typography";
import { Heading } from "./styles";


// ==============================================================


// ==============================================================

export function FooterContact({
  title,
  emailLabel,
  phoneLabel,
  email,
  phone,
  address
}) {
  return <Fragment>
      <Heading>{title || "Contact Us"}</Heading>

      <Typography variant="body1" sx={{
      py: 0.6
    }}>
        {address}
      </Typography>

      <Typography variant="body1" sx={{
      py: 0.6
    }}>
        {emailLabel || "Email"}: {email}
      </Typography>

      <Typography variant="body1" sx={{
      py: 0.6,
      mb: 2
    }}>
        {phoneLabel || "Phone"}: {phone}
      </Typography>
    </Fragment>;
}