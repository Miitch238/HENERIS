import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "gold";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide " +
  "transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-ground hover:bg-ink/90",
  gold: "bg-gold text-ink hover:bg-[color-mix(in_oklab,var(--gold)_88%,black)]",
  outline: "border border-ink text-ink hover:bg-ink hover:text-ground",
  ghost: "text-ink hover:bg-sunk",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8rem]",
  md: "h-12 px-7 text-[0.85rem]",
};

type StyleProps = { variant?: Variant; size?: Size };

type ButtonProps = StyleProps &
  React.ComponentProps<"button"> & { href?: undefined };

type LinkProps = StyleProps & React.ComponentProps<typeof Link> & { href: string };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (typeof rest.href === "string") {
    return <Link className={classes} {...(rest as React.ComponentProps<typeof Link>)} />;
  }

  return (
    <button className={classes} {...(rest as React.ComponentProps<"button">)} />
  );
}
