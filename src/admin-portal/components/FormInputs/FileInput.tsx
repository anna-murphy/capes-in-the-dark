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
        className="w-96 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200 text-sm"
      />
    </Base>
  );
}
