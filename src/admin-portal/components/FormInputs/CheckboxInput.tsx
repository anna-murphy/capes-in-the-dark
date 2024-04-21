import React from "react";

import { useInputId } from "./utils";
import { Base } from "./Base";

interface CheckboxProps {
  label: string;
  value: boolean;
  setValue: (newValue: boolean) => void;
}

export function CheckboxInput({
  label,
  value,
  setValue,
}: CheckboxProps): JSX.Element {
  const inputId = useInputId(label);
  return (
    <Base label={label} inputId={inputId}>
      <input
        id={inputId}
        type="checkbox"
        checked={value}
        onChange={() => {
          setValue(!value);
        }}
      />
    </Base>
  );
}
