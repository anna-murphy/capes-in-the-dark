import React from "react";

import { firestore } from "@admin-portal/utils/firebase";
import {
  collection,
  onSnapshot,
  query,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

const EPISODE_QUERY = query(collection(firestore, "api/v1/episodes"));

interface EpisodeViewProps {
  goToEpisode: (episodeId: string) => void;
}

export function EpisodeView({ goToEpisode }: EpisodeViewProps): JSX.Element {
  const [episodes, setEpisodes] = React.useState<
    Array<QueryDocumentSnapshot<DocumentData, DocumentData>> | undefined
  >();
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    return onSnapshot(EPISODE_QUERY, (snapshot) => {
      try {
        if (snapshot.empty) setError("No Episodes found");
        setEpisodes(snapshot.docs);
      } catch (ex) {
        const message = (ex as { message: string }).message;
        console.error(message);
        setError(message);
      }
    });
  }, []);

  if (episodes === undefined) return <p>Loading...</p>;
  if (episodes.length <= 0) return <p>No episodes found.</p>;

  return (
    <>
      <h1>Episodes</h1>
      <ul>
        {episodes.map((episode) => (
          <li>
            <a
              href="#"
              onClick={() => {
                goToEpisode(episode.id);
              }}
            >
              {episode.id}
            </a>
          </li>
        ))}
      </ul>
      {error !== "" ? <span>{error}</span> : undefined}
    </>
  );
}
