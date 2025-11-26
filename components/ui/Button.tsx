import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "default";
  size?: "sm" | "md" | "lg" | "icon";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const baseClasses = "rounded-lg font-medium transition-colors inline-flex items-center justify-center";
  
  const variantClasses = {
    primary: disabled 
      ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
      : "bg-brand-500 text-white hover:bg-brand-600",
    secondary: disabled
      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
      : "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: disabled
      ? "border border-gray-300 text-gray-400 cursor-not-allowed"
      : "border border-brand-500 text-brand-500 hover:bg-brand-50",
    default: disabled
      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
      : "bg-gray-100 text-gray-900 hover:bg-gray-200",
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    icon: "h-9 w-9 p-0",
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  
  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}

