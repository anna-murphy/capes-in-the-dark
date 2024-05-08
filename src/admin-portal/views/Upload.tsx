import React from "react";
import { addDoc, collection } from "firebase/firestore";
import {
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytes,
} from "firebase/storage";

import { EpisodeForm } from "@admin-portal/components";
import { firestore, storage } from "../utils/firebase";

interface UploadProps {
  onFinish: () => void;
}

export function Upload({ onFinish }: UploadProps): JSX.Element {
  const [error, setError] = React.useState("");

  const doUpload = React.useCallback(
    (podcastEpisode: PodcastEpisode) => {
      makeEpisodeDocument(podcastEpisode)
        .then(() => {
          onFinish();
        })
        .catch((ex) => {
          setError((ex as { message: string }).message);
        });
    },
    [onFinish, setError],
  );

  return (
    <>
      <h1 className="text-lg">Upload </h1>
      {error !== "" ? <p>{error}</p> : undefined}
      <EpisodeForm
        submit={doUpload}
        submitLabel="Upload"
        parseFile={uploadAudio}
      />
    </>
  );
}

async function uploadAudio(
  audioFile: File,
  season: number,
  episode: number,
  title: string,
): Promise<{ downloadUrl: string; size: number }> {
  const splitOnDot = audioFile.name.split(".");
  const path = `recordings/citwm-s${("000" + season).slice(-3)}-e${("000" + episode).slice(-3)}-${title.replaceAll(" ", "_")}.${splitOnDot[splitOnDot.length - 1]}`;
  const audioRef = ref(storage, path);
  await uploadBytes(audioRef, audioFile, {
    customMetadata: {
      metadata: JSON.stringify({ season, episode, title }),
    },
  });
  const downloadUrl = await getDownloadURL(audioRef);
  const metadata = await getMetadata(audioRef);
  return { downloadUrl, size: metadata.size };
}

async function makeEpisodeDocument(episode: PodcastEpisode): Promise<void> {
  const collectionRef = collection(firestore, "api/v1/episodes");
  await addDoc(collectionRef, episode);
}
