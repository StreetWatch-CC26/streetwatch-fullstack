import { Footer } from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session-token")?.value;

  const isLoggedIn = !!token;

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />

      <main>{children}</main>
      <Footer />
    </div>
  );
}
