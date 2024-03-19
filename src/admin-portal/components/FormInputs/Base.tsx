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
    <div>
      <label htmlFor={inputId}>{label}</label>
      {children}
    </div>
  );
}
