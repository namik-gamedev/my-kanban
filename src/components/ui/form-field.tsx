import type { ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
};

export const FormField = ({
  label,
  htmlFor,
  error,
  children,
}: FormFieldProps) => (
  <div className="flex flex-col gap-1.5 text-sm text-gray-300">
    <label htmlFor={htmlFor}>{label}</label>
    {children}
    {error && (
      <p className="text-xs text-red-300" role="alert">
        {error}
      </p>
    )}
  </div>
);

export const formControlClass =
  'w-full rounded-lg border border-white/10 bg-gray-900 px-3 py-2.5 text-sm text-gray-100 outline-none transition placeholder:text-gray-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 aria-[invalid=true]:border-red-400';
