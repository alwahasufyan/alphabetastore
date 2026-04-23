import { darken, lighten } from "@mui/material/styles";
import { components, typography, getPalette } from "./core";
import { COLORS } from "./types";
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1600,
    xxl: 1920
  }
};
const themeColorMap = {
  default: COLORS.DARK,
  dark: COLORS.DARK,
  red: COLORS.RED,
  green: COLORS.GREEN,
  orange: COLORS.ORANGE,
  gold: COLORS.GOLD,
  gift: COLORS.GIFT,
  paste: COLORS.PASTE,
  health: COLORS.HEALTH,
  bluish: COLORS.BLUISH,
  yellow: COLORS.YELLOW
};

function isValidHexColor(value) {
  return /^#([\da-fA-F]{6})$/.test(String(value || "").trim());
}

function resolveThemeColor(themeKey) {
  const key = String(themeKey || "default").toLowerCase();
  return themeColorMap[key] || COLORS.DARK;
}

export default function themeOptions({
  themeKey,
  primaryColor
} = {}) {
  const selectedPalette = getPalette(resolveThemeColor(themeKey));

  if (isValidHexColor(primaryColor)) {
    const normalizedColor = primaryColor.trim();
    selectedPalette.primary = {
      ...selectedPalette.primary,
      main: normalizedColor,
      light: lighten(normalizedColor, 0.4),
      dark: darken(normalizedColor, 0.25),
      contrastText: "#FFFFFF"
    };
  }

  const themeOption = {
    typography,
    components,
    breakpoints,
    palette: selectedPalette
  };
  return themeOption;
}