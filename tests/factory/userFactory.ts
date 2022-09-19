import { faker } from "@faker-js/faker";

export function userFactory() {
  const user = {
    email: faker.internet.email(),
    password: faker.lorem.word(),
  };
  return user;
}

export function createUserFactory() {
  const user = userFactory();
  const body = {
    email: user.email,
    password: user.password,
    confirmPassword: user.password,
  };
  return body;
}
