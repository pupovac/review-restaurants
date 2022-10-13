import { Response } from "express";

export const ok =
  (res: Response) =>
  (data = {}) => {
    res.status(200);
    res.json(data);
  };
