import jwt from "jsonwebtoken";
import { terms, categories, tests } from "@prisma/client";
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
  await testsRepositories.postTest(data);
}

export async function getAllTestsGroupedDiscipline(token: string) {
  const user = await verifyToken(token);
  if (!user) {
    throw { type: "unauthorized", message: "Token inválido" };
  }
  const terms = await testsRepositories.getAllTerms();
  const categories = await categoryRepositories.getAllCategories();

  const data = terms.map((term) => {
    return {
      termId: term.id,
      termNumber: term.number,
      disciplines: term.disciplines.map((discipline) => {
        return {
          id: discipline.id,
          name: discipline.name,
          categories: categories.map((category) => {
            return {
              id: category.id,
              name: category.name,
              tests: category.tests
                .map((test) => {
                  if (test.teacherDiscipline.discipline.id === discipline.id) {
                    return {
                      id: test.id,
                      name: test.name,
                      pdfUrl: test.pdfUrl,
                      teacher: test.teacherDiscipline.teacher.name,
                    };
                  }
                })
                .filter((test) => test),
            };
          }),
        };
      }),
    };
  });

  return data;
}

export async function getAllTestsGroupedTeacher(token: string) {
  const user = await verifyToken(token);
  if (!user) {
    throw { type: "unauthorized", message: "Token inválido" };
  }
  const teachers = await teacherRepositories.getAllTeachers();
  const categories = await categoryRepositories.getAllCategories();

  const data = teachers.map((teacher) => {
    return {
      teacherId: teacher.id,
      teacherName: teacher.name,
      categories: categories.map((category) => {
        return {
          id: category.id,
          name: category.name,
          tests: category.tests
            .map((test) => {
              if (test.teacherDiscipline.teacher.id === teacher.id) {
                return {
                  testId: test.id,
                  testName: test.name,
                  pdfUrl: test.pdfUrl,
                  discipline: test.teacherDiscipline.discipline.name,
                };
              }
            })
            .filter((test) => test),
        };
      }),
    };
  });
  return data;
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
      type: "badRequest",
      message: "Professor não da aula desta disciplina",
    };
  }
  return teacherDiscipline.id;
}
