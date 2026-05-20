import LoginForm from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Login to your StreetWatch account to access personalized features and manage your pothole reports. Enter your email and password to securely sign in and stay connected with the latest updates on road conditions in your area.",
};

export default function LoginPage() {
  return (
    // <div className="flex min-h-dvh flex-col items-center justify-center bg-muted dark:bg-muted p-6 md:p-10">
    //   <div className="w-full max-w-sm md:max-w-4xl">
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <LoginForm />
      </div>
    </main>
  );
}
