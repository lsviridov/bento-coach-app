import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, PageLayout } from "@/shared";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Offline from "./pages/Offline";
import Diary from "./pages/Diary";
import { Profile } from "./pages/Profile";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Camera from "./pages/Camera";
import Coach from "./pages/Coach";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/diary" element={<Diary />} />
            <Route path="/camera" element={
              <PageLayout>
                <Camera />
              </PageLayout>
            } />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:slug" element={<ProductDetail />} />
            <Route path="/profile" element={
              <PageLayout>
                <Profile />
              </PageLayout>
            } />
            <Route path="/coach" element={<Coach />} />
            <Route path="/offline" element={<Offline />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
