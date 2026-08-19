import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#16253f" },
    secondary: { main: "#4f6f9f" },
    background: { default: "#f5f7fb", paper: "#ffffff" },
    success: { main: "#2e9b65" },
    warning: { main: "#d79a26" },
    error: { main: "#d85b5b" }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", Arial, sans-serif',
    h4: { fontWeight: 800 },
    h5: { fontWeight: 750 },
    h6: { fontWeight: 700 }
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: { styleOverrides: { root: { boxShadow: "0 3px 18px rgba(20,35,60,.06)" } } }
  }
});

export default theme;
