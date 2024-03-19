import { Request, Response } from "express";
import { Route } from "./types";

export const ping: Route = {
  method: "GET",
  route: "/ping",
  handler: async function (_req: Request, res: Response) {
    res.status(200).send("pong");
  },
};
