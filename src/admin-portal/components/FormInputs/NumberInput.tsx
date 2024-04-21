import React from "react";

import { useInputId } from "./utils";
import { Base } from "./Base";

interface NumberInputProps {
  label: string;
  value: number;
  setValue: (newValue: number) => void;
}

export function NumberInput({
  label,
  value,
  setValue,
}: NumberInputProps): JSX.Element {
  const inputId = useInputId(label);
  return (
    <Base label={label} inputId={inputId}>
      <input
        id={inputId}
        type="number"
        value={value}
        onChange={(event) => {
          const value = Number(event.target.value);
          if (!isNaN(value)) setValue(value);
        }}
        className="py-1 px-2 rounded-md w-96 dark:text-slate-950"
      />
    </Base>
  );
}
