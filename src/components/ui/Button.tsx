import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "danger" | "text";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "secondary",
  loading = false,
  disabled,
  children,
  className = "",
  type = "button",
  ...props
}) => {
  let btnClass = "btn";
  if (variant === "primary") {
    btnClass += " btn-primary";
  } else if (variant === "secondary") {
    btnClass += " btn-secondary";
  } else if (variant === "accent") {
    btnClass += " btn-accent";
  } else if (variant === "danger") {
    btnClass += " bg-red-600 text-white hover:bg-red-500 shadow-md border-transparent";
  } else if (variant === "text") {
    btnClass = "bg-transparent border border-transparent hover:bg-zinc-800/50 text-zinc-300 hover:text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all text-sm font-medium";
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${btnClass} ${className}`}
      {...props}
    >
      {loading && <span className="spinner" style={{ width: "14px", height: "14px" }} />}
      {children}
    </button>
  );
};
