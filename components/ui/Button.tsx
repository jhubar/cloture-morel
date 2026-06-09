import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 min-h-11";

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-terracotta text-white hover:bg-terracotta-dark focus-visible:outline-terracotta",
  secondary:
    "bg-white text-forest-dark ring-1 ring-inset ring-sand-300 hover:bg-sand-200",
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
): string {
  return cn(base, sizes[size], variants[variant], className);
}

type CommonProps = {
  children: React.ReactNode;
  size?: Size;
  className?: string;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

function makeButton(variant: Variant) {
  return function StyledButton(props: ButtonAsButton | ButtonAsLink) {
    if ("href" in props && props.href !== undefined) {
      const { href, children, size, className, ...rest } = props;
      return (
        <Link href={href} className={buttonClasses(variant, size, className)} {...rest}>
          {children}
        </Link>
      );
    }
    const { children, size, className, ...rest } = props as ButtonAsButton;
    return (
      <button className={buttonClasses(variant, size, className)} {...rest}>
        {children}
      </button>
    );
  };
}

export const PrimaryButton = makeButton("primary");
export const SecondaryButton = makeButton("secondary");
