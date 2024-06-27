import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Footer from "./components/Footer";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import { theme } from "./customTheme";
import useTitle from "./hooks/useTitle";
import HomePage from "./pages/HomePage";

const App = () => {
  useTitle("MERN Invoice - Home");
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Footer />
      <ToastContainer theme="dark" />
    </ThemeProvider>
  );
};
export default App;
