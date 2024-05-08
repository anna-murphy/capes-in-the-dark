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
      <h1 className="text-lg">Episodes</h1>
      <ul role="list" className="list-disc pl-4">
        {episodes.map((episode) => (
          <li className="list-item">
            <a
              href="#"
              onClick={() => {
                goToEpisode(episode.id);
              }}
              className="text-sky-700 hover:text-sky-800 dark:text-sky-200 hover:dark:text-sky-300 underline"
            >
              {formatEpisodeTitle(episode.data() as PodcastEpisode)}
            </a>
          </li>
        ))}
      </ul>
      {error !== "" ? (
        <span className="text-red-700 dark:text-red-400">{error}</span>
      ) : undefined}
    </>
  );
}

function formatEpisodeTitle(episode: PodcastEpisode): JSX.Element {
  return (
    <>
      {episode.title}{" "}
      <span className="text-sky-600 dark:text-sky:300">
        ({episode.metadata.season}-{episode.metadata.episode})
      </span>
    </>
  );
}
