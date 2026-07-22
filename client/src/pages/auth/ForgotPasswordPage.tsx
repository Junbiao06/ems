import { useState } from "react";
import { ForgotPasswordForm } from "../../components/forgot-password/ForgotPasswordForm";
import { PasswordResetComplete } from "../../components/forgot-password/PasswordResetComplete";
import { PasswordResetCodeForm } from "../../components/forgot-password/PasswordResetCodeForm";
import { PasswordResetForm } from "../../components/forgot-password/PasswordResetForm";
import { LoginHero } from "../../components/login/LoginHero";

type PasswordResetStep = "email" | "code" | "password" | "complete";

export function ForgotPasswordPage() {
  const [step, setStep] = useState<PasswordResetStep>("email");

  const renderForm = () => {
    if (step === "code") {
      return (
        <PasswordResetCodeForm
          onBack={() => setStep("email")}
          onContinue={() => setStep("password")}
        />
      );
    }

    if (step === "password") {
      return (
        <PasswordResetForm
          onBack={() => setStep("code")}
          onContinue={() => setStep("complete")}
        />
      );
    }

    if (step === "complete") {
      return <PasswordResetComplete />;
    }

    return <ForgotPasswordForm onContinue={() => setStep("code")} />;
  };

  return (
    <main className="grid min-h-svh w-full max-w-full grid-cols-1 overflow-x-hidden bg-surface lg:grid-cols-2">
      <LoginHero />
      {renderForm()}
    </main>
  );
}
