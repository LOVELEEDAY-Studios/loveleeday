import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
}

interface ButtonAsButtonProps
  extends ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  as?: "button";
  href?: never;
  children: React.ReactNode;
}

interface ButtonAsLinkProps extends ButtonBaseProps {
  as: "link";
  href: string;
  children: React.ReactNode;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const sizeMap: Record<Size, React.CSSProperties> = {
  sm: { fontSize: "0.75rem", padding: "0.6rem 1.25rem" },
  md: { fontSize: "0.8rem", padding: "0.85rem 1.75rem" },
  lg: { fontSize: "0.85rem", padding: "1rem 2.25rem" },
};

const variantMap: Record<Variant, React.CSSProperties> = {
  primary: { backgroundColor: "var(--ink)", color: "var(--paper)" },
  secondary: {
    backgroundColor: "transparent",
    color: "var(--ink)",
    border: "1px solid var(--ink)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--ink)",
    borderBottom: "1px solid var(--ink)",
  },
};

function buildStyle(variant: Variant, size: Size): React.CSSProperties {
  return {
    fontFamily: "var(--font-sans-var), 'Instrument Sans', sans-serif",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 150ms ease",
    cursor: "pointer",
    border: "none",
    textDecoration: "none",
    borderRadius: 0,
    minHeight: "44px",
    ...sizeMap[size],
    ...variantMap[variant],
  };
}

export function Button(props: ButtonProps) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "md";
  const style = buildStyle(variant, size);

  if (props.as === "link") {
    return (
      <Link href={props.href} style={style} className="hover:opacity-80">
        {props.children}
      </Link>
    );
  }

  const { as: _as, variant: _v, size: _s, ...rest } = props as ButtonAsButtonProps;
  return (
    <button style={style} className="hover:opacity-80" {...rest} />
  );
}
