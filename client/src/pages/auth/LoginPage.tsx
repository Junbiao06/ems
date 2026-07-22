import { LoginForm } from "../../components/login/LoginForm";
import { LoginHero } from "../../components/login/LoginHero";

export function LoginPage() {
  return (
    <main className="grid min-h-svh w-full max-w-full grid-cols-1 overflow-x-hidden bg-surface lg:grid-cols-2">
      <LoginHero />
      <LoginForm />
    </main>
  );
}
