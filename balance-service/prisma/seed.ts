import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const clients = await prisma.clients.createMany({
    data: [
      { id: '532fe986-9602-49fc-9522-d5b883d4694a', name: 'João Neves', email: 'joao@neves.com' },
      { id: 'b4e73e51-626a-420d-b92d-795693b6f0bf', name: 'John Doe', email: 'john@doe.com' },
    ],
    skipDuplicates: true,
  })
  const joao = await prisma.clients.findUnique({ 
        where: { 
            email: 'joao@neves.com' 
        }, 
        select: { 
            id: true 
        } 
    })
  const john = await prisma.clients.findUnique({ 
        where: { 
            email: 'john@doe.com' 
        }, 
        select: { 
            id: true 
        } 
    })
  const accounts = await prisma.accounts.createMany({
    data: [
      { id: "532fe986-9602-49fc-9522-d5b883d4694a", client_id: joao?.id as string, balance: 100 },
      { id: "b4e73e51-626a-420d-b92d-795693b6f0bf", client_id: john?.id as string, balance: 200 },
    ],
    skipDuplicates: true,
  })
  console.log({ clients, accounts })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })