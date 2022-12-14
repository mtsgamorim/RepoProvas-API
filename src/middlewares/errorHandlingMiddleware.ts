import { Response, Request, NextFunction } from "express";

export default function errorHandlingMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.type === "unauthorized") return res.status(401).send(error.message);
  if (error.type === "conflict") return res.status(409).send(error.message);
  if (error.type === "notFound") return res.status(404).send(error.message);
  if (error.type === "badRequest") return res.status(400).send(error.message);
  return res.sendStatus(500);
}
