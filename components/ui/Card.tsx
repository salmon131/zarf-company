import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  const baseClasses = "bg-white/70 backdrop-blur-sm rounded-xl border-0 p-6 shadow-md";
  const hoverClasses = hover ? "transition-all duration-300 hover:shadow-xl cursor-pointer" : "";
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}

