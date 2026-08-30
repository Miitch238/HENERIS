import { Container } from "@/components/ui/container";

export default function LoadingShoppers() {
  return (
    <Container className="py-14 md:py-20">
      <div className="max-w-2xl">
        <div className="h-3 w-32 bg-sunk" />
        <div className="mt-4 h-10 w-3/4 bg-sunk" />
        <div className="mt-5 h-4 w-full bg-sunk" />
      </div>
      <div className="mt-10 h-14 w-full border border-hairline bg-surface" />
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="border border-hairline bg-surface p-5">
            <div className="flex gap-4">
              <div className="size-16 shrink-0 bg-sunk" />
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-24 bg-sunk" />
                <div className="h-4 w-32 bg-sunk" />
                <div className="h-3 w-40 bg-sunk" />
              </div>
            </div>
            <div className="mt-5 space-y-2 border-t border-hairline-soft pt-4">
              <div className="h-3 w-full bg-sunk" />
              <div className="h-3 w-2/3 bg-sunk" />
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
