import React from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { firestore } from "@admin-portal/utils/firebase";
import { EpisodeForm } from "@admin-portal/components/EpisodeForm";

interface EditEpisodeProps {
  id: string;
}

export function EditEpisode({ id }: EditEpisodeProps): JSX.Element {
  const documentReference = React.useMemo(
    () => doc(firestore, `api/v1/episodes/${id}`),
    [id],
  );
  const [episode, setEpisode] = React.useState<PodcastEpisode | undefined>();
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    getDoc(documentReference)
      .then((episodeDocument) => {
        if (episodeDocument.exists())
          setEpisode(episodeDocument.data() as PodcastEpisode);
        else throw new Error(`No episode "${id}" found.`);
      })
      .catch((ex) => {
        const message = (ex as { message: string }).message;
        console.error(message);
        setError(message);
      });
  }, [documentReference, id, setEpisode, setError]);

  const update = React.useCallback(
    (editedEpisode: PodcastEpisode) => {
      void setDoc(documentReference, editedEpisode);
    },
    [documentReference],
  );

  return (
    <>
      <h1 className="text-lg">Edit Episode</h1>
      {error !== "" ? <p>{error}</p> : undefined}
      {episode !== undefined ? (
        <EpisodeForm
          submit={update}
          episodeData={episode}
          submitLabel="Update"
        />
      ) : undefined}
    </>
  );
}
