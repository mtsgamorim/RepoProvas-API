import client from "../db/prismaClient";
import { tests } from "@prisma/client";

type CreateTestExpectInBank = Omit<tests, "id">;

export async function postTest(data: CreateTestExpectInBank) {
  await client.tests.create({ data });
}

export async function getAllTerms() {
  const terms = await client.terms.findMany({
    select: {
      id: true,
      number: true,
      disciplines: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return terms;
}
