import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../src/app";
import { testFactory } from "./factory/testsFactory";
import { getToken } from "./factory/tokenFactory";
import client from "../src/db/prismaClient";

beforeEach(async () => {
  await client.$executeRaw`TRUNCATE TABLE tests;`;
});

afterAll(() => {
  client.$disconnect;
});

describe("POST: /tests", () => {
  it("Caso sucesso: retornar status 201", async () => {
    const test = testFactory();
    const token = await getToken();
    const result = await supertest(app)
      .post("/tests")
      .set("Authorization", "Bearer " + token)
      .send(test);
    const status = result.status;
    expect(status).toEqual(201);
  });

  it("Caso erro: pdfURL não ser um link, retornar status 422", async () => {
    const test = testFactory();
    const token = await getToken();
    test.pdfUrl = faker.lorem.word();
    const result = await supertest(app)
      .post("/tests")
      .set("Authorization", "Bearer " + token)
      .send(test);
    const status = result.status;
    expect(status).toEqual(422);
  });

  it("Caso erro: chave nome enviada em branco, retornar status 422", async () => {
    const test = testFactory();
    const token = await getToken();
    test.name = "";
    const result = await supertest(app)
      .post("/tests")
      .set("Authorization", "Bearer " + token)
      .send(test);
    const status = result.status;
    expect(status).toEqual(422);
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

describe("GET: /tests/discipline", () => {
  it("Caso sucesso: retornar status 200 e um array", async () => {
    const token = await getToken();
    const result = await supertest(app)
      .get("/tests/discipline")
      .set("Authorization", "Bearer " + token)
      .send();
    const status = result.status;
    const body = result.body;
    expect(status).toEqual(200);
    expect(body).toBeInstanceOf(Array);
  });

  it("Caso erro: não enviar token, retornar status 401", async () => {
    const result = await supertest(app).get("/tests/discipline").send();
    const status = result.status;
    expect(status).toEqual(401);
  });

  it("Caso erro: enviar token inválido, retornar status 401", async () => {
    const token = faker.lorem.word();
    const result = await supertest(app)
      .get("/tests/discipline")
      .set("Authorization", "Bearer " + token)
      .send();
    const status = result.status;
    expect(status).toEqual(401);
  });
});

describe("GET: /tests/teacher", () => {
  it("Caso sucesso: retornar status 200 e um array", async () => {
    const token = await getToken();
    const result = await supertest(app)
      .get("/tests/teacher")
      .set("Authorization", "Bearer " + token)
      .send();
    const status = result.status;
    const body = result.body;
    expect(status).toEqual(200);
    expect(body).toBeInstanceOf(Array);
  });

  it("Caso erro: não enviar token, retornar status 401", async () => {
    const result = await supertest(app).get("/tests/teacher").send();
    const status = result.status;
    expect(status).toEqual(401);
  });

  it("Caso erro: enviar token inválido, retornar status 401", async () => {
    const token = faker.lorem.word();
    const result = await supertest(app)
      .get("/tests/teacher")
      .set("Authorization", "Bearer " + token)
      .send();
    const status = result.status;
    expect(status).toEqual(401);
  });
});
