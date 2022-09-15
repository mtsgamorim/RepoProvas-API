import { Request, Response, NextFunction } from "express";

export default function validateTokenExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    throw { type: "unauthorized", message: "Token não enviado" };
  }
  res.locals.token = token;
  next();
}
