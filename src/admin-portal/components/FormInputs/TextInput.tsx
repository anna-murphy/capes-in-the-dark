import React from "react";

import { useInputId } from "./utils";
import { Base } from "./Base";

interface TextInputProps {
  label: string;
  value: string;
  setValue: (newValue: string) => void;
  password?: boolean;
}

export function TextInput({
  label,
  value,
  setValue,
  password = false,
}: TextInputProps): JSX.Element {
  const inputId = useInputId(label);
  return (
    <Base label={label} inputId={inputId}>
      <input
        id={inputId}
        type={password ? "password" : "text"}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
    </Base>
  );
}
