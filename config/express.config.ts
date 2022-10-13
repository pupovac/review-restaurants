import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import "../server/controllers/index";
import { responses } from "../server/responses";

const app = express();

app.use(responses);
app.use(bodyParser.json({ limit: "25mb" }));
app.use(bodyParser.urlencoded({ limit: "25mb", extended: true, parameterLimit: 50000 }));

app.use(cors({ credentials: true, origin: [process.env.CLIENT_APP!] }));

export const expressApp = app;
