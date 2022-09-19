import supertest from "supertest";
import { userFactory, createUserFactory } from "./factory/userFactory";
import { faker } from "@faker-js/faker";
import app from "../src/app";
import client from "../src/db/prismaClient";
import bcrypt from "bcrypt";
import { testFactory } from "./factory/testsFactory";

beforeEach(async () => {
  await client.$executeRaw`TRUNCATE TABLE users;`;
});

afterAll(() => {
  client.$disconnect;
});

async function getToken() {
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

describe("POST: /sign-up", () => {
  it("Caso sucesso: Retornar code 201", async () => {
    const user = createUserFactory();
    const result = await supertest(app).post("/sign-up").send(user);
    const status = result.status;
    expect(status).toEqual(201);
  });

  it("Caso erro: E-mail ja cadastrado no sistema, retornar erro 409", async () => {
    const user = createUserFactory();
    await client.users.create({
      data: {
        email: user.email,
        password: user.password,
      },
    });
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

describe("POST: /sign-in", () => {
  it("Caso sucesso: retornar status 200 e um token", async () => {
    const user = userFactory();
    await client.users.create({
      data: {
        email: user.email,
        password: bcrypt.hashSync(user.password, 10),
      },
    });
    const result = await supertest(app).post("/sign-in").send(user);
    const status = result.status;
    const token = result.body;
    expect(status).toEqual(200);
    expect(token).toBeInstanceOf(Object);
    expect(token).not.toBe(null);
  });

  it("Caso erro: Usuario não cadastrado, retornar status 401", async () => {
    const user = userFactory();
    const result = await supertest(app).post("/sign-in").send(user);
    const status = result.status;
    expect(status).toEqual(401);
  });

  it("Caso erro: Senha digitada é incorreta, retornar status 401", async () => {
    const user = userFactory();
    await client.users.create({
      data: {
        email: user.email,
        password: bcrypt.hashSync(user.password, 10),
      },
    });
    user.email = faker.internet.email();
    const result = await supertest(app).post("/sign-in").send(user);
    const status = result.status;
    expect(status).toEqual(401);
  });

  it("Caso erro: Email não é um email, retornar status 422", async () => {
    const user = userFactory();
    user.email = faker.lorem.word();
    const result = await supertest(app).post("/sign-in").send(user);
    const status = result.status;
    expect(status).toEqual(422);
  });
});

describe("POST: /tests", () => {
  it("Caso sucesso: retornar status code 201", async () => {
    const test = testFactory();
    const token = await getToken();
    const result = await supertest(app)
      .post("/tests")
      .set("Authorization", "Bearer " + token)
      .send(test);
    const status = result.status;
    expect(status).toEqual(201);
  });

  it("Caso erro: token não enviado, retornar status 401", async () => {
    const test = testFactory();
    const result = await supertest(app).post("/tests").send(test);
    const status = result.status;
    expect(status).toEqual(401);
  });

  it("Caso erro: token inválido, retornar status 401", async () => {
    const test = testFactory();
    const token = faker.lorem.word();
    const result = await supertest(app)
      .post("/tests")
      .set("Authorization", "Bearer " + token)
      .send(test);
    const status = result.status;
    expect(status).toEqual(401);
  });

  it("Caso erro: Categoria não existe, retornar status 404", async () => {
    const test = testFactory();
    test.category = faker.lorem.word();
    const token = await getToken();
    const result = await supertest(app)
      .post("/tests")
      .set("Authorization", "Bearer " + token)
      .send(test);
    const status = result.status;
    expect(status).toEqual(404);
  });

  it("Caso erro: Disciplina não existe, retornar status 404", async () => {
    const test = testFactory();
    test.discipline = faker.lorem.word();
    const token = await getToken();
    const result = await supertest(app)
      .post("/tests")
      .set("Authorization", "Bearer " + token)
      .send(test);
    const status = result.status;
    expect(status).toEqual(404);
  });

  it("Caso erro: Professor não existe, retornar status 404", async () => {
    const test = testFactory();
    test.teacher = faker.lorem.word();
    const token = await getToken();
    const result = await supertest(app)
      .post("/tests")
      .set("Authorization", "Bearer " + token)
      .send(test);
    const status = result.status;
    expect(status).toEqual(404);
  });

  it("Caso erro: Professor não da aula para essa categoria, retornar status 404", async () => {
    const test = testFactory();
    test.teacher = "Bruna Hamori";
    const token = await getToken();
    const result = await supertest(app)
      .post("/tests")
      .set("Authorization", "Bearer " + token)
      .send(test);
    const status = result.status;
    expect(status).toEqual(400);
  });
});
