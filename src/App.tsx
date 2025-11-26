import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tootltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import FormBuilder from "./pages/FormBuilder";
import Auth from "./pages/Auth";
import PublicForm from "./pages/PublicForm";
import Login from "./components/Auth/Login";
import ResetPassword from "./components/Auth/ResetPassword";
import Signup from "./components/Auth/Signup";
import OAuthSuccess from "./pages/OAuthsucess";
import ForgotPassword from "./pages/ForgotPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Index />} /> */}
          {/* <Route path="/" element={<Auth />} /> */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          <Route path="/reset-password/" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />


          <Route
            path="/login"
            element={
              <Login />
            }
          />

          <Route
            path="/forgot-password"
            element={
              <ForgotPassword />
            }
          />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/builder/:id" element={<FormBuilder />} />

          <Route path = '/oauth-success' element = {<OAuthSuccess />} />
          <Route path="/formbuild/:id" element={<PublicForm />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
