import React from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { firestore } from "@admin-portal/utils/firebase";
import { EpisodeForm } from "@admin-portal/components";

interface EditEpisodeProps {
  id: string;
  onFinish: () => void;
}

export function EditEpisode({ id, onFinish }: EditEpisodeProps): JSX.Element {
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
      setDoc(documentReference, editedEpisode)
        .then(() => {
          onFinish();
        })
        .catch((ex) => {
          setError((ex as { message: string }).message);
        });
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
