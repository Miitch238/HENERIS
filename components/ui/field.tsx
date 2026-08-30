import { cn } from "@/lib/utils";

/**
 * Base commune aux champs. Le focus visible est géré globalement
 * (:focus-visible dans globals.css) ; on garde juste le passage de la bordure
 * en or profond comme affordance discrète.
 */
const fieldBase =
  "w-full border border-hairline bg-surface px-3 text-[0.95rem] text-ink " +
  "transition-colors placeholder:text-ink-faint focus-visible:border-gold-deep";

export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-[0.8rem] font-medium text-ink">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-ink-faint">{hint}</p> : null}
    </div>
  );
}

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(fieldBase, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(fieldBase, "py-2 leading-relaxed", className)}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn(fieldBase, "h-11", className)} {...props} />;
}

export function FormError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="border-l-2 border-danger bg-danger/8 px-3 py-2 text-[0.85rem] text-danger"
    >
      {children}
    </p>
  );
}

export function FormNotice({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p
      role="status"
      className="border-l-2 border-success bg-success/8 px-3 py-2 text-[0.85rem] text-success"
    >
      {children}
    </p>
  );
}
