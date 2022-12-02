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
  setInterval(async function () {
    const lat = parseFloat(
      faker.address.latitude(-10.6681857235, -43.6345972634)
    );
    const lng = parseFloat(
      faker.address.longitude(153.569469029, 113.338953078)
    );

    await prisma.request.create({
      data: {
        baseId: "appOXt5N1bZJEWmMs",
        tableId: "tbl43hYB96AviCUH1",
        asn: 123,
        city: "Ballarat",
        continent: "AU",
        country: "AU",
        createdAt: new Date(),
        latitude: lat,
        longitude: lng,
        latlng: `${lat}-${lng}`,
        region: "VIC",
      },
    });
  }, 1000);

  // let requests = [];
  // const now = new Date();

  // for (let i = 0; i < 10000; i++) {
  //   if (Math.random() > 0.5) {
  //     continue;
  //   }

  //   const lat = parseFloat(faker.address.latitude(-37, -38, 3));
  //   const lng = parseFloat(faker.address.longitude(144, 143, 3));

  //   requests.push({
  //     baseId: "appOXt5N1bZJEWmMs",
  //     tableId: "tbl43hYB96AviCUH1",
  //     asn: 123,
  //     city: "Ballarat",
  //     continent: "AU",
  //     country: "AU",
  //     createdAt: new Date(now.getTime() + 1000 * i),
  //     latitude: lat,
  //     longitude: lng,
  //     latlng: `${lat}-${lng}`,
  //     region: "VIC",
  //   });

  //   // await prisma.base.create({
  //   //   include: {
  //   //     tables: {
  //   //       include: {
  //   //         views: true,
  //   //       },
  //   //     },
  //   //   },
  //   //   data: {
  //   //     email: "thedanielfergusonkid@gmail.com",
  //   //     name: faker.company.name(),
  //   //     id: faker.datatype.uuid(),
  //   //     keysEmail: "thedanielfergusonkid@gmail.com",
  //   //     tables: {
  //   //       create: [0, 1, 2, 3, 4, 5, 6].map(() => ({
  //   //         id: faker.datatype.uuid(),
  //   //         name: faker.company.name(),
  //   //         views: {
  //   //           create: [0, 1, 2].map((index) => ({
  //   //             id: faker.datatype.uuid(),
  //   //             name: faker.company.name(),
  //   //             type: getRandomViewType(),
  //   //           })),
  //   //         },
  //   //       })),
  //   //     },
  //   //   },
  //   // });
  // }

  // const chunkSize = 1000;

  // for (let index = 0; index < requests.length; index++) {
  //   const chunk = requests.slice(index, index + chunkSize);

  //   await prisma.request.createMany({
  //     data: chunk,
  //     skipDuplicates: true,
  //   });
  // }
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
