import { Request, Response } from "express";

export type Route = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  route: string;
  handler: (req: Request, res: Response) => Promise<void>;
};
