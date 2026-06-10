import React from "react";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  gradient?: boolean;
  children: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({
  level = "h2",
  gradient = false,
  children,
  className = "",
  ...props
}) => {
  const Component = level;

  let baseClass = "";
  if (level === "h1") {
    baseClass = "text-2xl font-bold tracking-tight text-white";
    if (gradient) {
      baseClass = "text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent";
    }
  } else if (level === "h2") {
    baseClass = "text-xl font-semibold tracking-tight text-white";
  } else if (level === "h3") {
    baseClass = "text-lg font-semibold tracking-tight text-white";
  } else if (level === "h4") {
    baseClass = "text-base font-semibold text-white";
  } else {
    baseClass = "text-sm font-semibold text-white";
  }

  return (
    <Component className={`${baseClass} ${className}`} {...props}>
      {children}
    </Component>
  );
};
