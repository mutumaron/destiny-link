import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthProvider";
import AuthPage from "./pages/auth";
import Dashboard from "./pages/dashboard";
import RequireAdmin from "./middleware/RequireAdmin";
import Unauthorized from "./pages/unauthorized";
import HomePage from "./pages/dashboard/HomePage";

import HistoryPage from "./pages/dashboard/HistoryPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import ProductsPage from "./pages/dashboard/ProductPage";
import BookingsPage from "./pages/dashboard/BookingPage";
import { ThemeProvider } from "./components/Providers/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />

        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/dashboard"
                element={
                  <RequireAdmin>
                    <Dashboard />
                  </RequireAdmin>
                }
              >
                <Route index element={<HomePage />} />
                <Route path="bookings" element={<BookingsPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route path="/unauthorized" element={<Unauthorized />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
