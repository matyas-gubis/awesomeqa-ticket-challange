import "../styles/globals.css";
import { Button, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import { LocalizationProvider } from "@mui/x-date-pickers";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5D50C34D",
      dark: "#1c1c1F",
      light: "#302F36",
      contrastText: "#F7F8F8",
    },
    secondary: {
      main: "#5D50C3",
      dark: "#1c1c1F",
      light: "#302F36",
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default MyApp;
