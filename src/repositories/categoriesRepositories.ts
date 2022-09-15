import client from "../db/prismaClient";

export async function getCategorybyName(name: string) {
  const category = await client.categories.findFirst({
    where: {
      name: name,
    },
  });
  return category;
}
