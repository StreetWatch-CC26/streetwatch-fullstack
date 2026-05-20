import { Footer } from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authjs.session-token")?.value;

  const isLoggedIn = !!token;

  const completedOnboarding =
    cookieStore.get("has-completed-onboarding")?.value === "true";

  // Redirect jika user login tapi belum onboarding
  if (!completedOnboarding) {
    redirect("/welcome");
  }

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />

      <main>{children}</main>
      <Footer />
    </div>
  );
}
