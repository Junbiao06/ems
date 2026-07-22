import { useState } from "react";
import { InvitationDetails } from "../../components/register/InvitationDetails";
import { RegistrationCodeForm } from "../../components/register/RegistrationCodeForm";
import { RegistrationComplete } from "../../components/register/RegistrationComplete";
import { RegistrationPasswordForm } from "../../components/register/RegistrationPasswordForm";
import { LoginHero } from "../../components/login/LoginHero";

type RegistrationStep = "invitation" | "code" | "password" | "complete";

export function RegisterPage() {
  const [step, setStep] = useState<RegistrationStep>("invitation");

  const renderForm = () => {
    if (step === "code") {
      return (
        <RegistrationCodeForm
          onBack={() => setStep("invitation")}
          onContinue={() => setStep("password")}
        />
      );
    }

    if (step === "password") {
      return (
        <RegistrationPasswordForm
          onBack={() => setStep("code")}
          onContinue={() => setStep("complete")}
        />
      );
    }

    if (step === "complete") {
      return <RegistrationComplete />;
    }

    return <InvitationDetails onContinue={() => setStep("code")} />;
  };

  return (
    <main className="grid min-h-svh w-full max-w-full grid-cols-1 overflow-x-hidden bg-surface lg:grid-cols-2">
      <LoginHero />
      {renderForm()}
    </main>
  );
}
