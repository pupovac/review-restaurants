import { Request, Response } from "express";

export const badRequest = (req: Request, res: Response) => (error: Error) => {
  res.status(400);
  res.json(error);
};
