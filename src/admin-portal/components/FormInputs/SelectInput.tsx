import React from "react";

import { useInputId } from "./utils";
import { Base } from "./Base";

interface SelectInputProps {
  label: string;
  values: Array<string | { label: string; value: string | number }>;
  value: string | number;
  setValue: (newValue: string | number) => void;
}

export function SelectInput({
  label,
  values,
  value,
  setValue,
}: SelectInputProps): JSX.Element {
  const inputId = useInputId(label);
  return (
    <Base label={label} inputId={inputId}>
      <select
        id={inputId}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      >
        <option disabled>~~Choose One~~</option>
        {values.map((opt) => {
          const { label, value } =
            typeof opt === "string" ? { label: opt, value: opt } : opt;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </Base>
  );
}
