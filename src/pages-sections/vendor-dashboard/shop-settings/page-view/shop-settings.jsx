"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

// LOCAL CUSTOM COMPONENT
import SettingsForm from "../settings-form";
export default function ShopSettingsPageView() {
  return <Box py={4} maxWidth={740} margin="auto">
      <Typography variant="h3" sx={{
      mb: 2
    }}>
        Shop Settings
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Manage shop contact details, order policy, and legal agreement texts shown on customer registration. Global options like theme, language, and currency are in Site Settings.
      </Typography>

      <Card sx={{
      p: 3
    }}>
        {/* BASIC SETTING SECTION */}
        <Typography variant="h6" sx={{
        mb: 3
      }}>
          Basic Settings
        </Typography>

        <SettingsForm />
      </Card>
    </Box>;
}