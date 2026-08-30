import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { getCurrentProfile } from "@/lib/queries/profile";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  return (
    <>
      <Navbar isAuthed={profile !== null} />
      <main id="contenu" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
