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
      createdBy: true,
      createdAt: true,
      updatedAt: true,
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

  const response = {
    id: user?.id,
    username: user?.username,
    name: user?.name,
    isSuperuser: user?.isSuperuser,
    rolesId: user?.roles.map(r => r.role.id),
    rolesName: user?.roles.map(r => r.role.name),
    createdBy: user?.createdBy,
    createdAt: user?.createdAt,
    updatedAt: user?.updatedAt
  }

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }

  return {
    success: true,
    data: response,
  }
})