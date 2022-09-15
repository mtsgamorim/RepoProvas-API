import jwt, { JwtPayload } from "jsonwebtoken";
import * as categoryRepositories from "../repositories/categoriesRepositories";
import * as userRepositories from "../repositories/userRepositories";
import * as teacherRepositories from "../repositories/teachersRepositories";
import * as disciplinesRepositories from "../repositories/disciplinesRepositories";
import * as teacherDisciplinesRepositories from "../repositories/teacherDisciplinesRepositories";
import * as testsRepositories from "../repositories/testsRepositories";
import { testCreate } from "../types/testsInterface";

export async function createTest(token: string, test: testCreate) {
  const user = await verifyToken(token);
  if (!user) {
    throw { type: "unauthorized", message: "Token inválido" };
  }
  const categoryId = await getCategoryId(test.category);
  const disciplineId = await getDisciplineId(test.discipline);
  const teacherId = await getTeacherId(test.teacher);
  const teacherDisciplineId = await getTeacherDisciplineId(
    disciplineId,
    teacherId
  );
  const data = {
    name: test.name,
    pdfUrl: test.pdfUrl,
    categoryId,
    teacherDisciplineId,
  };
  await testsRepositories.postTeacher(data);
}

async function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET;
  try {
    const userId: any = jwt.verify(token, secret);
    const user = await userRepositories.getUserbyId(userId.id);
    return user;
  } catch (error) {
    return null;
  }
}

async function getCategoryId(categoryName: string) {
  const category = await categoryRepositories.getCategorybyName(categoryName);
  if (!category) {
    throw { type: "notFound", message: "Categoria não existente" };
  }
  return category.id;
}

async function getDisciplineId(disciplineName: string) {
  const discipline = await disciplinesRepositories.getDisciplinebyName(
    disciplineName
  );
  if (!discipline) {
    throw { type: "notFound", message: "Disciplina não existente" };
  }
  return discipline.id;
}

async function getTeacherId(teacherName: string) {
  const teacher = await teacherRepositories.getTeacherbyName(teacherName);
  if (!teacher) {
    throw { type: "notFound", message: "Professor não existente" };
  }
  return teacher.id;
}

async function getTeacherDisciplineId(disciplineId: number, teacherId: number) {
  const teacherDiscipline =
    await teacherDisciplinesRepositories.getTeacherDisciplinesId({
      disciplineId,
      teacherId,
    });
  if (!teacherDiscipline) {
    throw {
      type: "notFound",
      message: "Professor não da aula desta disciplina",
    };
  }
  return teacherDiscipline.id;
}
