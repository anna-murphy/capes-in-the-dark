import React from "react";
/*
import { EpisodeForm } from "@admin-portal/components/EpisodeForm";
import { firestore, storage } from "@admin-portal/utils/firebase";
import { getDownloadURL, getMetadata, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

function pad(num: number, padSize = 3): string {
  return (Array.from(Array(padSize), () => "0").join("") + num).slice(-1 * padSize);
}

async function uploadAudio(
  audioFile: File,
  season: number,
  episode: number,
  title: string,
): Promise<{ downloadUrl: string; size: number }> {
  const splitOnDot = audioFile.name.split(".");
  const path = `recordings/citwm-s${pad(season, 3)}-e${pad(episode, 3)}-${title.replaceAll(" ", "_")}.${splitOnDot[splitOnDot.length - 1]}`;
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

export function Upload(): JSX.Element {
  return (
    <>
      <h1>Upload an Episode</h1>
      <EpisodeForm submitLabel="Upload" submit={makeEpisodeDocument} parseFile={uploadAudio} />
    </>
  );
}
*/


import {
  FileInput,
  NumberInput,
  TextInput,
  SelectInput,
  CheckboxInput,
  ParagraphInput,
} from "@admin-portal/components/FormInputs";
import { firestore, storage } from "../utils/firebase";
import {
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Timestamp, addDoc, collection } from "firebase/firestore";

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

function makeEpisodeData(
  title: string,
  duration: number,
  fileUrl: string,
  fileSize: number,
  episodeType: EpisodeType,
  explicit: boolean,
  description: string,
  seasonNumber: number,
  episodeNumber: number,
): PodcastEpisode {
  const data: PodcastEpisode = {
    feed: "Capes in the West March",
    title,
    description,
    // Save this as a firebase Timestamp to upload to the database.
    publishDate: Timestamp.fromDate(new Date()) as unknown as Date,
    imageLink: "",
    metadata: {
      season: seasonNumber,
      episode: episodeNumber,
      type: episodeType,
      explicit,
    },
    fileData: {
      url: fileUrl,
      size: fileSize,
      duration,
    },
  };
  return data;
}

async function makeEpisodeDocument(episode: PodcastEpisode): Promise<void> {
  const collectionRef = collection(firestore, "api/v1/episodes");
  await addDoc(collectionRef, episode);
}

export function Upload(): JSX.Element {
  const [title, setTitle] = React.useState("");
  const [duration, setDuration] = React.useState(0);
  const [seasonNumber, setSeasonNumber] = React.useState(1);
  const [episodeNumber, setEpisodeNumber] = React.useState(1);
  const [file, setFile] = React.useState<File | undefined>();
  const [episodeType, setEpisodeType] = React.useState<EpisodeType>("full");
  const [explicit, setExplicit] = React.useState(true);
  const [description, setDescription] = React.useState("");

  const [error, setError] = React.useState("");

  const submit = React.useCallback<SubmitCallback>(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (file === undefined) {
        setError("Choose a file to upload");
        return;
      }
      try {
        const { downloadUrl, size } = await uploadAudio(
          file,
          seasonNumber,
          episodeNumber,
          title,
        );
        const episodeData = makeEpisodeData(
          title,
          duration,
          downloadUrl,
          size,
          episodeType,
          explicit,
          description,
          seasonNumber,
          episodeNumber,
        );
        await makeEpisodeDocument(episodeData);
      } catch (ex) {
        setError((ex as { message: string }).message);
      }
    },
    [
      title,
      duration,
      seasonNumber,
      episodeNumber,
      file,
      episodeType,
      explicit,
      description,
      setError,
    ],
  );
  // Title
  // File
  // Duration
  // Image (choose from list?)
  // Explicit (default yes)
  // Description
  // Type (default full)

  return (
    <>
      <h1>Upload an Episode</h1>
      <form onSubmit={submit}>
        <TextInput label="Episode Title" value={title} setValue={setTitle} />
        <NumberInput
          label="Season"
          value={seasonNumber}
          setValue={setSeasonNumber}
        />
        <NumberInput
          label="Episode"
          value={episodeNumber}
          setValue={setEpisodeNumber}
        />
        <FileInput label="MP3 File" setValue={setFile} accept="audio/mpeg" />
        <NumberInput
          label="Duration (seconds)"
          value={duration}
          setValue={setDuration}
        />
        <SelectInput
          label="Episode Type"
          values={["full", "trailer", "bonus"]}
          value={episodeType}
          setValue={(value: string) => {
            setEpisodeType(value as EpisodeType);
          }}
        />
        <CheckboxInput
          label="Explicit?"
          value={explicit}
          setValue={setExplicit}
        />
        <ParagraphInput
          label="Description"
          value={description}
          setValue={setDescription}
        />
        <button type="submit">Upload</button>
      </form>
      {error !== "" ? <p>{error}</p> : undefined}
    </>
  );
}
