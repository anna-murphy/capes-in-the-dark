import React from "react";
import { doc, getDoc } from "firebase/firestore";

import { firestore } from "@admin-portal/utils/firebase";
import { SelectInput } from "./SelectInput";

interface SeasonSelectProps {
  value: string | number;
  setValue: (newValue: string | number) => void;
}

interface StaticSeasons {
  seasonIds: Array<{ id: number; name: string }>;
}

const BASE_SEASONS_LIST: StaticSeasons["seasonIds"] = [
  { id: 1, name: "Capes in the West March S1" },
  { id: 2, name: "The Avant Guard" },
];

export function SeasonSelect({
  value,
  setValue,
}: SeasonSelectProps): JSX.Element {
  const [staticSeasons, setStaticSeasons] = React.useState<
    StaticSeasons["seasonIds"]
  >([]);
  React.useEffect(() => {
    getDoc(doc(firestore, "api/v1/static/seasons"))
      .then((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data !== undefined) {
            setStaticSeasons((data as StaticSeasons).seasonIds);
            return;
          }
        }
        setStaticSeasons(BASE_SEASONS_LIST);
      })
      .catch(console.error);
  }, []);
  return (
    <SelectInput
      label="Season"
      value={value}
      setValue={setValue}
      values={staticSeasons.map(({ id, name }) => ({ label: name, value: id }))}
    />
  );
}
