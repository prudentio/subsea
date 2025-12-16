import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const userId = event.context.user.sub

  const user = await prisma.userAccount.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      name: true,
      isSuperuser: true,
      createdAt: true,
      roles: {
        select: {
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }

  return {
    success: true,
    data: user,
  }
})