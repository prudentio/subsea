import { PrismaClient } from '../prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

async function main() {
   const systemUserId = crypto.randomUUID()

  await prisma.userAccount.createMany({
    data: [
      {
        id: systemUserId,
        username: 'admin',
        name: 'Administrator',
        password: "$2a$12$YIOeD5AEl/UN27rjsib9bOFfjx202Wx6/yuMpNqkHz7A7aJ42Rpgu",
        isSuperuser: true,
        createdBy: systemUserId,
      },
      {
        id: crypto.randomUUID(),
        username: 'user',
        name: 'Regular User',
        password: "$2a$12$YIOeD5AEl/UN27rjsib9bOFfjx202Wx6/yuMpNqkHz7A7aJ42Rpgu",
        isSuperuser: false,
        createdBy: systemUserId,
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Seed success')
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
