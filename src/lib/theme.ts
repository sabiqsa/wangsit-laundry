"use client";

import { createTheme } from "@mui/material/styles";

const appleFontFamily =
  '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const appleTypography = {
  fontFamily: appleFontFamily,
  h1: { fontWeight: 700, letterSpacing: "-0.005em" },
  h2: { fontWeight: 700, letterSpacing: "-0.005em" },
  h3: { fontWeight: 700 },
  h4: { fontWeight: 600 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  body1: { fontSize: "17px", lineHeight: 1.5 },
  body2: { fontSize: "15px", lineHeight: 1.5 },
};

const appleComponents = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none" as const,
        borderRadius: 980,
        fontFamily: appleFontFamily,
        fontSize: "17px",
        fontWeight: 400,
        padding: "8px 22px",
        boxShadow: "none",
        "&:hover": { boxShadow: "none" },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 18,
        boxShadow: "none",
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0071e3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6e6e73",
    },
    background: {
      default: "#f5f5f7",
      paper: "#ffffff",
    },
    text: {
      primary: "#1d1d1f",
      secondary: "#6e6e73",
    },
  },
  typography: appleTypography,
  components: appleComponents,
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2997ff",
      contrastText: "#000000",
    },
    secondary: {
      main: "#86868b",
    },
    background: {
      default: "#000000",
      paper: "#1d1d1f",
    },
    text: {
      primary: "#f5f5f7",
      secondary: "#86868b",
    },
  },
  typography: appleTypography,
  components: appleComponents,
});
