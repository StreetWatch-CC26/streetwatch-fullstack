import { RegisterForm } from "@/components/auth/register-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-muted dark:bg-muted  p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <RegisterForm />
      </div>
    </div>
  );
}
