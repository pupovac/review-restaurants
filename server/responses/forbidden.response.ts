import { Request, Response } from "express";

export const forbidden =
  (req: Request, res: Response) =>
  (error = {}) => {
    res.status(403);
    res.json(error);
  };
