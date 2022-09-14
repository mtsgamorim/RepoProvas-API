import client from "../db/prismaClient";
import { users } from "@prisma/client";

type CreateUserData = Omit<users, "id">;

export async function getUserbyEmail(email: string) {
  const user = await client.users.findFirst({
    where: {
      email: email,
    },
  });
  return user;
}

export async function createUser(data: CreateUserData) {
  await client.users.create({ data });
}

export async function getUserbyId(id: number) {
  const user = await client.users.findFirst({
    where: {
      id: id,
    },
  });
  return user;
}
