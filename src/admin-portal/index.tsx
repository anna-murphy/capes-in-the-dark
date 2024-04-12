import React from "react";

import { EpisodeView, Login, Upload } from "./views";

import type { UserCredential } from "firebase/auth";
import { EditEpisode } from "./views/EditEpisode";

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
          <div>
            <a
              onClick={() => {
                if (page !== "EPISODES") setPage("EPISODES");
              }}
              aria-disabled={page === "EPISODES"}
            >
              View Episodes
            </a>
            <a
              onClick={() => {
                if (page !== "UPLOAD") setPage("UPLOAD");
              }}
              aria-disabled={page === "UPLOAD"}
            >
              Upload
            </a>
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
            <EditEpisode id={editId} />
          ) : undefined}
          {page === "UPLOAD" ? <Upload /> : undefined}
        </>
      ) : undefined}
    </>
  );
}
