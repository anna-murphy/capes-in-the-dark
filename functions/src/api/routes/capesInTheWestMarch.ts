import { Request, Response } from "express";
import { Route } from "./types";
import { getMostRecentRss } from "../../utils/firestore";

export const citwmFeed: Route = {
  method: "GET",
  route: "/capes-in-the-west-march/rss.xml",
  handler: async function (_req: Request, res: Response) {
    try {
      const rssFeed = await getMostRecentRss("Capes in the West March");
      res.setHeader("content-type", "application/rss+xml ");
      res.status(200).send(rssFeed.rss);
    } catch (ex) {
      res.sendStatus(404);
    }
  },
};
