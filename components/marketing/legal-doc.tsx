import { Container } from "@/components/ui/container";

export function LegalDoc({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="max-w-2xl py-16 md:py-24">
      <p className="eyebrow">Légal</p>
      <h1 className="mt-4 text-3xl md:text-4xl">{title}</h1>
      <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-faint">
        Dernière mise à jour&nbsp;: {updated}
      </p>

      <div className="legal mt-10">{children}</div>

      <p className="mt-14 border-l-2 border-warning bg-warning/8 px-4 py-3 text-[0.82rem] text-ink-soft">
        Ce document est un modèle de travail. Faites-le relire par un
        professionnel du droit avant la mise en ligne définitive et complétez
        les mentions marquées <span className="font-mono">[À COMPLÉTER]</span>.
      </p>
    </Container>
  );
}
