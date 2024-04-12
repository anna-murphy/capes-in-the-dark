import React from "react";

import { useInputId } from "./utils";
import { Base } from "./Base";

interface FileInputProps {
  label: string;
  setValue: (newValue: File) => void;
  accept: string;
}

export function FileInput({
  label,
  setValue,
  accept,
}: FileInputProps): JSX.Element {
  const inputId = useInputId(label);
  return (
    <Base label={label} inputId={inputId}>
      <input
        id={inputId}
        type="file"
        onChange={(event) => {
          if (event.target.files !== null && event.target.files.length > 0) {
            const file = event.target.files[0];
            setValue(file);
          }
        }}
        accept={accept}
      />
    </Base>
  );
}
