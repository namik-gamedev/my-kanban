import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'danger-solid';

const variantClasses = {
  primary: 'bg-blue-500 text-white hover:bg-blue-400',
  secondary: 'text-gray-300 hover:bg-white/10',
  danger: 'text-red-300 hover:bg-red-500/10',
  'danger-solid': 'bg-red-500 text-white hover:bg-red-400',
} satisfies Record<ButtonVariant, string>;

export const Button = ({
  variant = 'secondary',
  className = '',
  children,
  ...props
}: ButtonProps) => (
  <button
    className={`rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);
