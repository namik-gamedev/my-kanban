import type { ReactNode } from 'react';

type FormActionsProps = {
  children: ReactNode;
  destructiveAction?: ReactNode;
};

export const FormActions = ({
  children,
  destructiveAction,
}: FormActionsProps) => (
  <footer className="mt-2 flex items-center justify-between gap-2">
    {destructiveAction ?? <span />}
    <div className="flex gap-2">{children}</div>
  </footer>
);
