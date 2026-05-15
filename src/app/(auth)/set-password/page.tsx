import SetPasswordForm from "@/components/auth/SetPasswordForm";

export default async function SetPasswordPage() {
  return (
    // <main className="flex min-h-dvh flex-col items-center justify-center bg-muted dark:bg-muted p-6 md:p-10">
    //   <div className="w-full max-w-sm md:max-w-4xl">
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <SetPasswordForm />
      </div>
    </main>
  );
}
