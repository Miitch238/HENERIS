/**
 * demo-icons.tsx
 *
 * The original component imports 9 named icons from this module, but the source
 * for it was never published alongside the component. These are stand-ins built
 * from `lucide-react` so the drawer renders correctly out of the box. Swap any of
 * them for your own SVGs if you need pixel-exact art.
 *
 * Every icon forwards `LucideProps`, so you can still pass `size` / `className`
 * / `strokeWidth` at the call site.
 */
import {
  Ban,
  EyeOff,
  FileKey2,
  KeyRound,
  Lock,
  ScanFace,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  type LucideProps,
} from "lucide-react";

/* ---- Header icons (shown large at the top of a drawer view) ---- */

export const DangerIcon = (props: LucideProps) => (
  <ShieldAlert className="text-red-500 dark:text-red-400" size={36} {...props} />
);

export const RecoveryPhraseIcon = (props: LucideProps) => (
  <ScrollText
    className="text-neutral-900 dark:text-neutral-100"
    size={36}
    {...props}
  />
);

/* ---- List / inline icons ---- */

export const LockIcon = (props: LucideProps) => (
  <Lock className="text-neutral-700 dark:text-neutral-300" size={20} {...props} />
);

export const PassIcon = (props: LucideProps) => (
  <FileKey2
    className="text-neutral-700 dark:text-neutral-300"
    size={20}
    {...props}
  />
);

export const KeyIcon = (props: LucideProps) => (
  <KeyRound
    className="text-neutral-700 dark:text-neutral-300"
    size={20}
    {...props}
  />
);

export const WarningIcon = (props: LucideProps) => (
  <TriangleAlert
    className="text-red-600 dark:text-red-400"
    size={20}
    {...props}
  />
);

export const ShieldIcon = (props: LucideProps) => (
  <ShieldCheck className="text-emerald-500" size={22} {...props} />
);

export const PhraseIcon = (props: LucideProps) => (
  <EyeOff
    className="text-neutral-500 dark:text-neutral-400"
    size={22}
    {...props}
  />
);

export const BannedIcon = (props: LucideProps) => (
  <Ban className="text-red-500 dark:text-red-400" size={22} {...props} />
);

export const FaceIDIcon = (props: LucideProps) => (
  <ScanFace className="text-white" size={20} {...props} />
);
