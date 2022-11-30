import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

function generateRandomNumber(max: number) {
  return Math.floor(Math.random() * max);
}

function getRandomViewType(): string {
  const types = [
    "grid",
    "form",
    "calendar",
    "gallery",
    "kanban",
    "timeline",
    "block",
  ];

  return types[generateRandomNumber(types.length)];
}

async function main() {
  for (let i = 0; i < 10; i++) {
    await prisma.base.create({
      include: {
        tables: {
          include: {
            views: true,
          },
        },
      },
      data: {
        email: "thedanielfergusonkid@gmail.com",
        name: faker.company.name(),
        id: faker.datatype.uuid(),
        keysEmail: "thedanielfergusonkid@gmail.com",
        tables: {
          create: [0, 1, 2, 3, 4, 5, 6].map(() => ({
            id: faker.datatype.uuid(),
            name: faker.company.name(),
            views: {
              create: [0, 1, 2].map((index) => ({
                id: faker.datatype.uuid(),
                name: faker.company.name(),
                type: getRandomViewType(),
              })),
            },
          })),
        },
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
