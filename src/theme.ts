import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1E1E1E", // top bar background (dark gray)
    },
    secondary: {
      main: "#00cc66", // Minecraft green
    },
    success: {
      main: "#00cc66",
    },
    error: {
      main: "#ff5555",
    },
    warning: {
      main: "#ffaa00",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        },
      },
    },
  },
});
