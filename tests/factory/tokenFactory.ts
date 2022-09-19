import supertest from "supertest";
import bcrypt from "bcrypt";
import app from "../../src/app";
import client from "../../src/db/prismaClient";
import { userFactory } from "./userFactory";

export async function getToken() {
  const user = userFactory();
  await client.users.create({
    data: {
      email: user.email,
      password: bcrypt.hashSync(user.password, 10),
    },
  });
  const { body } = await supertest(app).post("/sign-in").send(user);
  const token = body.token;
  return token;
}
