import client from "../db/prismaClient";
import { teachersDisciplines } from "@prisma/client";

type CreateTeacherDiscipline = Omit<teachersDisciplines, "id">;

export async function getTeacherDisciplinesId(data: CreateTeacherDiscipline) {
  const teacherDiscipline = await client.teachersDisciplines.findFirst({
    where: {
      teacherId: data.teacherId,
      disciplineId: data.disciplineId,
    },
  });
  return teacherDiscipline;
}
