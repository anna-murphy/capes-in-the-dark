import express from "express";

import { routes } from "./routes";
import { onRequest } from "firebase-functions/v2/https";

const expressApp = express();

routes.forEach(({ route, method, handler }) => {
    if (method === "GET") expressApp.get(route, handler);
    if (method === "DELETE") expressApp.delete(route, handler);
    if (method === "PUT") expressApp.put(route, handler);
    if (method === "PATCH") expressApp.patch(route, handler);
    if (method === "POST") expressApp.post(route, handler);
});

// Found at localhost:5001/capes-in-the-dark/us-central1/api/ROUTE
export const feeds = onRequest(expressApp);
