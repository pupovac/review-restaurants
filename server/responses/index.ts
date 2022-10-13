import { Request, Response, NextFunction } from "express";
import { ok } from "./ok.response";
import { created } from "./created.response";
import { noContent } from "./no-content.response";
import { badRequest } from "./bad-request.response";
import { conflict } from "./conflict.response";
import { notFound } from "./not-found.response";
import { unauthorized } from "./unauthorized.response";
import { forbidden } from "./forbidden.response";
import { serverError } from "./server-error.response";

export const responses = (req: Request, res: Response, next: NextFunction) => {
  res.ok = ok(res);
  res.created = created(res);
  res.noContent = noContent(res);
  res.badRequest = badRequest(req, res);
  res.conflict = conflict(req, res);
  res.notFound = notFound(req, res);
  res.unauthorized = unauthorized(req, res);
  res.forbidden = forbidden(req, res);
  res.serverError = serverError(req, res);
  next();
};
