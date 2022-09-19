import { faker } from "@faker-js/faker";

export function testFactory() {
  const test = {
    name: faker.lorem.words(),
    pdfUrl: faker.internet.url(),
    category: "Prática",
    discipline: "JavaScript",
    teacher: "Diego Pinho",
  };
  return test;
}
