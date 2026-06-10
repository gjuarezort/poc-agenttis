import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  interactive = false,
  children,
  className = "",
  style = {},
  ...props
}) => {
  const baseClass = interactive ? "glass-panel glass-panel-interactive" : "glass-panel";
  return (
    <div 
      className={`${baseClass} ${className}`} 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        padding: "1.5rem", 
        minWidth: "280px",
        ...style 
      }}
      {...props}
    >
      {children}
    </div>
  );
};
