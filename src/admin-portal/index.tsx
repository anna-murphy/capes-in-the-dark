import React from "react";
import type { UserCredential } from "firebase/auth";

import { EpisodeView, EditEpisode, Login, Upload } from "./views";

const PAGES = ["EPISODES", "EDIT", "UPLOAD"] as const;
type Page = (typeof PAGES)[number];

export function AdminPortal(): JSX.Element {
  const [credentials, setCredentials] = React.useState<
    UserCredential | undefined
  >(undefined);
  const [page, setPage] = React.useState<Page>("EPISODES");
  const [editId, setEditId] = React.useState<string | undefined>();
  return (
    <>
      {credentials === undefined ? (
        <Login setCredentials={setCredentials} />
      ) : undefined}
      {credentials !== undefined ? (
        <>
          <div className="w-full flex flex-row gap-2">
            <h1 className="text-xl flex-1">Podcast Admin</h1>
            {page !== "EPISODES" ? (
              <button
                onClick={() => {
                  setPage("EPISODES");
                }}
                className="rounded-md bg-sky-700 dark:bg-sky-800 hover:bg-sky-900 text-slate-100 px-4 py-1"
              >
                View Episodes
              </button>
            ) : undefined}
            {page !== "UPLOAD" ? (
              <button
                onClick={() => {
                  setPage("UPLOAD");
                }}
                className="rounded-md bg-sky-700 dark:bg-sky-800  hover:bg-sky-900 text-slate-100 px-4 py-1"
              >
                Upload
              </button>
            ) : undefined}
          </div>
          {page === "EPISODES" ? (
            <EpisodeView
              goToEpisode={(episodeId) => {
                setPage("EDIT");
                setEditId(episodeId);
              }}
            />
          ) : undefined}
          {page === "EDIT" && editId !== undefined ? (
            <EditEpisode
              id={editId}
              onFinish={() => {
                setPage("EPISODES");
              }}
            />
          ) : undefined}
          {page === "UPLOAD" ? (
            <Upload
              onFinish={() => {
                setPage("EPISODES");
              }}
            />
          ) : undefined}
        </>
      ) : undefined}
    </>
  );
}
