

interface Role {
  id: string
  name: string | null
  description: string | null
  createdBy: string | null
  createdAt: Date
  updatedAt: Date | null
}

export default defineEventHandler(async () => {
  const listRole: Role[] =
    await prisma.role.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
      },
    })

  if (!listRole) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Role not found',
    })
  }

  return {
    success: true,
    data: listRole,
  }
})
