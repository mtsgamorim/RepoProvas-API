import { Request, Response } from "express";
import * as testsServices from "../services/testsService";
import { testCreate } from "../types/testsInterface";

export async function createTest(req: Request, res: Response) {
  const token = res.locals.token;
  const createTest: testCreate = req.body;
  await testsServices.createTest(token, createTest);
  res.sendStatus(201);
}

export async function getAllTestsGroupedDiscipline(
  req: Request,
  res: Response
) {
  const token = res.locals.token;
  const data = await testsServices.getAllTestsGroupedDiscipline(token);
  res.status(200).send(data);
}

export async function getAllTestsGroupedTeacher(req: Request, res: Response) {
  const token = res.locals.token;
  const data = await testsServices.getAllTestsGroupedTeacher(token);
  res.status(200).send(data);
}
