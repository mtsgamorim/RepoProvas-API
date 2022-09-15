import { Request, Response } from "express";
import * as testsServices from "../services/testsService";
import { testCreate } from "../types/testsInterface";

export async function createTest(req: Request, res: Response) {
  const token = res.locals.token;
  const createTest: testCreate = req.body;
  await testsServices.createTest(token, createTest);
  res.sendStatus(201);
}
