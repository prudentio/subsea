export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  await prisma.userAccount.delete({
    where: {
      id: id!,
    },
  })

  return {
    success: true,
  }
})