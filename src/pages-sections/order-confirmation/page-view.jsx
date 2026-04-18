"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

// STYLED COMPONENT
import { Wrapper, StyledButton } from "./styles";
export default function OrderConfirmationPageView() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId")?.trim() || "";
  const orderLabel = orderId ? `#${orderId.slice(0, 8).toUpperCase()}` : null;

  return <Container className="mt-2 mb-5">
      <Wrapper>
        <Image width={116} height={116} alt="complete" src="/assets/images/illustrations/party-popper.svg" />

        <Typography variant="h1" fontWeight={700}>
          Order placed successfully
        </Typography>

        <Typography fontSize={16} variant="body1" color="text.secondary" sx={{
        padding: ".5rem 2rem"
      }}>
          We received your order and marked it for cash on delivery. Our team can now review and confirm it.
        </Typography>

        {orderLabel ? <Typography fontSize={16} variant="body1" color="text.secondary">
            Your order number is <strong>{orderLabel}</strong>.
          </Typography> : null}

        {orderId ? <Typography fontSize={14} variant="body2" color="text.secondary" sx={{
        mt: 1
      }}>
            Reference ID: {orderId}
          </Typography> : null}

        <StyledButton color="primary" disableElevation variant="contained" className="button-link" LinkComponent={Link} href="/market-1">
          Browse products
        </StyledButton>
      </Wrapper>
    </Container>;
}