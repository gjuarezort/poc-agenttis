import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "info" | "warning" | "danger" | "neutral";
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  children,
  className = "",
  ...props
}) => {
  let badgeClass = "badge";
  if (variant === "success") {
    badgeClass += " badge-success";
  } else if (variant === "info") {
    badgeClass += " badge-info";
  } else if (variant === "warning") {
    badgeClass += " badge-warning";
  } else if (variant === "danger") {
    badgeClass += " bg-red-500/10 text-red-500 border border-red-500/20";
  } else {
    badgeClass += " bg-zinc-800 text-zinc-400 border border-zinc-700/50";
  }

  return (
    <span className={`${badgeClass} ${className}`} {...props}>
      {children}
    </span>
  );
};
