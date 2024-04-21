import React from "react";

interface BaseProps {
  label: string;
  inputId: string;
}

export function Base({
  label,
  inputId,
  children,
}: React.PropsWithChildren<BaseProps>): JSX.Element {
  return (
    <div className="flex flex-col gap-0">
      <label
        htmlFor={inputId}
        className="text-sm text-slate-500 dark:text-slate-400"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
