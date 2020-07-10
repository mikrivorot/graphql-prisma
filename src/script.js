// Do not forget to regenerate 
/**
Summary of your workflow

To recap, this is the typical workflow you will follow when updating your data:

Manually adjust your Prisma data model.
Migrate your database using the prisma migrate CLI commands we covered.
(Re-)generate Prisma Client
Use Prisma Client in your application code to access your database.
 */
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main() {
  await prisma.link.deleteMany();
  await prisma.author.deleteMany();
  
  const firstLink = await prisma.link.create({
    data: {
      description: 'First Fullstack tutorial for GraphQL (without author)',
      url: 'www.howtographql.com',
    }
  });
  
  await prisma.link.create({
      data: {
        description: 'Second tutorial (with author)',
        url: 'some url',
        author: {
          create: {
            name: 'Second Author'
        }
      }
    }
  })

  await prisma.link.create({
      data: {
        description: 'Third tutorial',
        url: 'node js url'
      }
  })

  const thirdLink = await prisma.link.findOne({where: {url: 'node js url'}})
  
  const thirdAuthor = await prisma.author.create({
    data: {
      name: 'Third author'
    }
  })

  await prisma.link.update({
    where: {id: firstLink.id},
    data: {
      author: {
        create: {name: 'First author'}
      }
    }
  })

  await prisma.link.update({
    where: {id: thirdLink.id},
    data: {
      author: {
        connect: {id: thirdAuthor.id}
      }
    }
  })
  
  // You will write all your queries inside this function
  // Это пока отдельный сервер для prisma
  // как передаются данные в программу?
  const allLinks = await prisma.link.findMany();
  const allAuthors = await prisma.author.findMany();

  console.log(allLinks)
  console.log(allAuthors)
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.disconnect()
  })

  // How to select name of migration to migrate up?
