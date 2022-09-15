import client from "../db/prismaClient";

export async function getDisciplinebyName(name: string) {
  const discipline = await client.disciplines.findFirst({
    where: {
      name: name,
    },
  });
  return discipline;
}
