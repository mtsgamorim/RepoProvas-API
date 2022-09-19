import { Request, Response } from "express";
import * as usersServices from "../services/usersService";

export async function createUser(req: Request, res: Response) {
  const { email, password } = req.body;
  await usersServices.createUser(email, password);
  res.sendStatus(201);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const token = await usersServices.login(email, password);
  res.status(200).send({ token });
}
