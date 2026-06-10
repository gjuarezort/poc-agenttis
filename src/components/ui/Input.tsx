import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full px-3 py-2 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all ${className}`}
      {...props}
    />
  );
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ children, className = "", ...props }) => {
  return (
    <select
      className={`w-full px-3 py-2 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea: React.FC<TextareaProps> = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`w-full px-3 py-2 bg-[var(--bg-surface-solid)] border border-[var(--border-color)] rounded-md text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--color-primary)] transition-all ${className}`}
      {...props}
    />
  );
};
