import React from "react";

import { useInputId } from "./utils";
import { Base } from "./Base";

interface ParagraphInputProps {
  label: string;
  value: string;
  setValue: (newValue: string) => void;
}

export function ParagraphInput({
  label,
  value,
  setValue,
}: ParagraphInputProps): JSX.Element {
  const inputId = useInputId(label);
  return (
    <Base label={label} inputId={inputId}>
      <textarea
        id={inputId}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
    </Base>
  );
}
