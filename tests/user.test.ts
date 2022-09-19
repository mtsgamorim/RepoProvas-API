import supertest from "supertest";
import { userFactory, createUserFactory } from "./factory/user";
import { faker } from "@faker-js/faker";
import app from "../src/app";
import client from "../src/db/prismaClient";

beforeEach(async () => {
  await client.$executeRaw`TRUNCATE TABLE users;`;
});

afterAll(() => {
  client.$disconnect;
});

describe("/sign-up", () => {
  it("Caso sucesso: Retornar code 201", async () => {
    const user = createUserFactory();
    const result = await supertest(app).post("/sign-up").send(user);
    const status = result.status;
    expect(status).toEqual(201);
  });

  it("Caso erro: E-mail ja cadastrado no sistema, retornar erro 409", async () => {
    const user = createUserFactory();
    await supertest(app).post("/sign-up").send(user);
    const result = await supertest(app).post("/sign-up").send(user);
    const status = result.status;
    expect(status).toEqual(409);
  });

  it("Caso erro: Confirmar senha incorreto, retornar erro 422", async () => {
    const user = userFactory();
    const body = {
      email: user.email,
      password: user.password,
      confirmPassword: faker.lorem.word(10),
    };
    const result = await supertest(app).post("/sign-up").send(body);
    const status = result.status;
    expect(status).toEqual(422);
  });

  it("Caso erro: Email não é um email, retornar erro 422", async () => {
    const user = createUserFactory();
    user.email = faker.lorem.word();
    const result = await supertest(app).post("/sign-up").send(user);
    const status = result.status;
    expect(status).toEqual(422);
  });
});
