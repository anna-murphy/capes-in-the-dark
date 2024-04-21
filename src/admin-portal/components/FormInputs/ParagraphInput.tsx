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
        className="py-2 px-2 rounded-md w-96 h-64 dark:text-slate-950 font-mono"
      />
      <span className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">
        This field supports Markdown input!
      </span>
    </Base>
  );
}
