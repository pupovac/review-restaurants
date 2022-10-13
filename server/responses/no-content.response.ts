import { Response } from "express";

export const noContent =
  (res: Response) =>
  (data = {}) => {
    res.status(204);
  };
