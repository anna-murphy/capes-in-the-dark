import React from "react";
import {
  FileInput,
  NumberInput,
  TextInput,
  SelectInput,
  CheckboxInput,
  ParagraphInput,
  SeasonSelect,
} from "./FormInputs";
import { Timestamp } from "firebase/firestore";

interface EpisodeFormPromps {
  episodeData?: PodcastEpisode;
  parseFile?: (
    file: File,
    season: number,
    episode: number,
    title: string,
  ) => Promise<{ downloadUrl: string; size: number }>;
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
      return await parseFile(
        uploadedFile,
        editedEpisodeData.season,
        editedEpisodeData.episode,
        editedEpisodeData.title,
      );
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
        const publishDate =
          episodeData === undefined
            ? Timestamp.fromDate(new Date())
            : (episodeData.publishDate as unknown as Timestamp);
        submit(
          makeEpisodeData(
            {
              ...editedEpisodeData,
              file: { downloadUrl, size },
            },
            publishDate,
          ),
        );
      } catch (ex) {
        setError((ex as { message: string }).message);
      }
    },
    [doParseFile, editedEpisodeData, file, submit],
  );

  return (
    <>
      <form
        onSubmit={doSubmit}
        className="flex flex-col gap-4 content-center items-center py-4 rounded-md bg-slate-100 dark:bg-slate-900"
      >
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
        <SeasonSelect
          value={editedEpisodeData.season}
          setValue={(season) => {
            setEditedEpisodeData((existingData) => ({
              ...existingData,
              season: Number(season),
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
        <button
          type="submit"
          className="rounded-md bg-sky-700 dark:bg-sky-800  hover:bg-sky-900 text-slate-100 px-4 py-1"
        >
          {submitLabel}
        </button>
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

function makeEpisodeData(
  editedData: EditedEpisodeData,
  publishDate: Timestamp,
): PodcastEpisode {
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
    publishDate: publishDate as unknown as Date, // Timestamp.fromDate(new Date()) as unknown as Date,
  } satisfies PodcastEpisode;
}
