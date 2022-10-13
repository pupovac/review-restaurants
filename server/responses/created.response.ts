import { Response } from "express";

export const created =
  (res: Response) =>
  (data = {}) => {
    res.status(201);
    res.json(data);
  };
