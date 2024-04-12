import React from "react";

export function useInputId(
  label: string = "input",
  formId: string = "form",
): string {
  const inputId = React.useMemo(
    () => `${formId}-${Math.floor(Math.random() * 100)}`,
    [formId],
  );
  return inputId;
}
