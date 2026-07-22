import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";

const EmployeesPage = lazy(async () => {
  const employeesModule = await import("./pages/employees/EmployeesPage");

  return { default: employeesModule.EmployeesPage };
});

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route
            path="/employees"
            element={
              <Suspense
                fallback={
                  <div className="h-72 animate-pulse rounded-xl border border-border bg-surface-muted" />
                }
              >
                <EmployeesPage />
              </Suspense>
            }
          />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster
        position="top-center"
        containerStyle={{ top: 24 }}
        toastOptions={{
          duration: 4000,
          style: {
            width: "min(440px, calc(100vw - 32px))",
            maxWidth: "440px",
            padding: "18px 20px",
            border: "1px solid var(--ui-border)",
            borderRadius: "14px",
            background: "var(--ui-surface)",
            color: "var(--ui-text)",
            fontFamily: "Outfit, sans-serif",
            fontSize: "15px",
            fontWeight: 700,
            lineHeight: 1.5,
          },
          success: {
            iconTheme: {
              primary: "var(--ui-success-text)",
              secondary: "var(--ui-success-surface)",
            },
          },
        }}
      />
    </>
  );
}

export default App;
