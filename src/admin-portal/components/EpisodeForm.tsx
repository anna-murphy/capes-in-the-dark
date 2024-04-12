import React from "react";
import {
  FileInput,
  NumberInput,
  TextInput,
  SelectInput,
  CheckboxInput,
  ParagraphInput,
} from "./FormInputs";
import { Timestamp } from "firebase/firestore";

interface EpisodeFormPromps {
  episodeData?: PodcastEpisode;
  parseFile?: (file: File) => Promise<{ downloadUrl: string; size: number }>;
  submit: (episode: PodcastEpisode) => void;
  submitLabel: string;
}

interface EditedEpisodeData {
  title: string;
  duration: number;
  season: number;
  episode: number;
  episodeType: EpisodeType;
  explicit: boolean;
  description: string;
  file: { downloadUrl: string; size: number };
}

export function EpisodeForm({
  submit,
  submitLabel,
  episodeData,
  parseFile,
}: EpisodeFormPromps): JSX.Element {
  const [editedEpisodeData, setEditedEpisodeData] =
    React.useState<EditedEpisodeData>(startingEpisodeData(episodeData));
  const [file, setFile] = React.useState<File | undefined>();
  const [error, setError] = React.useState("");

  const doParseFile = React.useCallback(
    async (uploadedFile: File | undefined) => {
      if (parseFile === undefined) return editedEpisodeData.file;
      if (uploadedFile === undefined)
        throw new Error("Don't forget to upload an episode!");
      return await parseFile(uploadedFile);
    },
    [parseFile, editedEpisodeData],
  );

  const doSubmit = React.useCallback<
    Exclude<React.DOMAttributes<HTMLFormElement>["onSubmit"], undefined>
  >(
    async (event) => {
      event.preventDefault();
      try {
        const { downloadUrl, size } = await doParseFile(file);
        submit(
          makeEpisodeData({
            ...editedEpisodeData,
            file: { downloadUrl, size },
          }),
        );
      } catch (ex) {
        setError((ex as { message: string }).message);
      }
    },
    [doParseFile, editedEpisodeData, file, submit],
  );

  return (
    <>
      <form onSubmit={doSubmit}>
        <TextInput
          label="Episode Title"
          value={editedEpisodeData.title}
          setValue={(title) => {
            setEditedEpisodeData((existingData) => ({
              ...existingData,
              title,
            }));
          }}
        />
        <NumberInput
          label="Season"
          value={editedEpisodeData.season}
          setValue={(season) => {
            setEditedEpisodeData((existingData) => ({
              ...existingData,
              season,
            }));
          }}
        />
        <NumberInput
          label="Episode"
          value={editedEpisodeData.episode}
          setValue={(episode) => {
            setEditedEpisodeData((existingData) => ({
              ...existingData,
              episode,
            }));
          }}
        />
        {parseFile !== undefined ? (
          <FileInput label="MP3 File" setValue={setFile} accept="audio/mpeg" />
        ) : undefined}
        <NumberInput
          label="Duration (seconds)"
          value={editedEpisodeData.duration}
          setValue={(duration) => {
            setEditedEpisodeData((existingData) => ({
              ...existingData,
              duration,
            }));
          }}
        />
        <SelectInput
          label="Episode Type"
          values={["full", "trailer", "bonus"]}
          value={editedEpisodeData.episodeType}
          setValue={(type) => {
            setEditedEpisodeData((existingData) => ({
              ...existingData,
              episodeType: type as EpisodeType,
            }));
          }}
        />
        <CheckboxInput
          label="Explicit?"
          value={editedEpisodeData.explicit}
          setValue={(explict) => {
            setEditedEpisodeData((existingData) => ({
              ...existingData,
              explict,
            }));
          }}
        />
        <ParagraphInput
          label="Description"
          value={editedEpisodeData.description}
          setValue={(description) => {
            setEditedEpisodeData((existingData) => ({
              ...existingData,
              description,
            }));
          }}
        />
        <button type="submit">{submitLabel}</button>
      </form>
      {error !== "" ? <p>{error}</p> : undefined}
    </>
  );
}

function startingEpisodeData(
  episodeData: PodcastEpisode | undefined,
): EditedEpisodeData {
  return {
    title: episodeData === undefined ? "" : episodeData.title,
    duration: episodeData === undefined ? 0 : episodeData.fileData.duration,
    season: episodeData === undefined ? 1 : episodeData.metadata.season,
    episode: episodeData === undefined ? 1 : episodeData.metadata.episode,
    file:
      episodeData === undefined
        ? { downloadUrl: "", size: 0 }
        : {
            downloadUrl: episodeData.fileData.url,
            size: episodeData.fileData.size,
          },
    episodeType:
      episodeData?.metadata.type === undefined
        ? "full"
        : episodeData.metadata.type,
    explicit: episodeData === undefined ? true : episodeData.metadata.explicit,
    description: episodeData === undefined ? "" : episodeData.description,
  };
}

function makeEpisodeData(editedData: EditedEpisodeData): PodcastEpisode {
  return {
    feed: "Capes in the West March",
    title: editedData.title,
    description: editedData.description,
    imageLink: "",
    metadata: {
      season: editedData.season,
      episode: editedData.episode,
      type: editedData.episodeType,
      explicit: editedData.explicit,
    },
    fileData: {
      url: editedData.file.downloadUrl,
      size: editedData.file.size,
      duration: editedData.duration,
    },
    // Save this as a firebase Timestamp to upload to the database.
    publishDate: Timestamp.fromDate(new Date()) as unknown as Date,
  } satisfies PodcastEpisode;
}
