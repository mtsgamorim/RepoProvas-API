import client from "../db/prismaClient";

export async function getCategorybyName(name: string) {
  const category = await client.categories.findFirst({
    where: {
      name: name,
    },
  });
  return category;
}

export async function getAllCategories() {
  const categories = await client.categories.findMany({
    select: {
      id: true,
      name: true,
      tests: {
        select: {
          id: true,
          name: true,
          pdfUrl: true,
          teacherDiscipline: {
            select: {
              teacher: {
                select: {
                  id: true,
                  name: true,
                },
              },
              discipline: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return categories;
}
