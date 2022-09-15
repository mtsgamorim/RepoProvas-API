import client from "../db/prismaClient";
import { tests } from "@prisma/client";

type CreateTestExpectInBank = Omit<tests, "id">;

export async function postTeacher(data: CreateTestExpectInBank) {
  await client.tests.create({ data });
}
