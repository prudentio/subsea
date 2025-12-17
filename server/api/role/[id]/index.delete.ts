export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  await prisma.role.delete({
    where: {
      id: id!,
    },
  })

  return {
    success: true,
  }
})