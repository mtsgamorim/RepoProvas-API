import supertest from "supertest";
import { faker } from "@faker-js/faker";
import app from "../src/app";
import client from "../src/db/prismaClient";
import { testFactory } from "./factory/testsFactory";
import bcrypt from "bcrypt";
import { userFactory } from "./factory/userFactory";

beforeEach(async () => {
  await client.$executeRaw`TRUNCATE TABLE tests;`;
});

afterAll(() => {
  client.$disconnect;
});

describe("POST: /tests", () => {
  it("Caso sucesso: retornar status code 201", async () => {
    const test = testFactory();
    const user = userFactory();
    await client.users.create({
      data: {
        email: user.email,
        password: bcrypt.hashSync(user.password, 10),
      },
    });
    const { body } = await supertest(app).post("/sign-in").send(user);
    const token = body.token;
    console.log(token);
    const result = await supertest(app)
      .post("/tests")
      .set("Authorization", "Bearer " + token)
      .send(test);
    const status = result.status;
    expect(status).toEqual(201);
  });
});
