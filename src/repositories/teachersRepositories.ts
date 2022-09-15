import client from "../db/prismaClient";

export async function getTeacherbyName(name: string) {
  const teacher = await client.teachers.findFirst({
    where: {
      name: name,
    },
  });
  return teacher;
}
