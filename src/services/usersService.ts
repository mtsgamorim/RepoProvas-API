import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as userRepositories from "../repositories/userRepositories";

dotenv.config();

export async function createUser(email: string, password: string) {
  await verifyEmailAlreadyExists(email);
  const passwordEncrypted = bcrypt.hashSync(password, 10);
  const data = { email, password: passwordEncrypted };
  await userRepositories.createUser(data);
}

export async function login(email: string, password: string) {
  const user = await findUser(email);
  await verifyPassword(password, user.password);
  const token = createToken(user.id);
  return token;
}

async function verifyEmailAlreadyExists(email: string) {
  const userInDB = await userRepositories.getUserbyEmail(email);
  if (userInDB) {
    throw { type: "conflict", message: "Email ja cadastrado" };
  }
}

async function findUser(email: string) {
  const userInDB = await userRepositories.getUserbyEmail(email);
  if (!userInDB) {
    throw { type: "unauthorized", message: "Login ou senha incorreto" };
  }
  return userInDB;
}

async function verifyPassword(password: string, cryptedPassword: string) {
  if (!bcrypt.compareSync(password, cryptedPassword)) {
    throw { type: "unauthorized", message: "Login ou senha incorreto" };
  }
}

function createToken(id: number) {
  const secret = process.env.JWT_SECRET;
  const data = { id };
  const token = jwt.sign(data, secret);
  return token;
}
