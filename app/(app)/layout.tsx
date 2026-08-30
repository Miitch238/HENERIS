import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/queries/profile";
import { AppHeader } from "@/components/app/app-header";
import { Container } from "@/components/ui/container";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/connexion?suite=/tableau-de-bord");

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader profile={profile} />
      <main id="contenu" tabIndex={-1} className="flex-1 py-10 md:py-14">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
