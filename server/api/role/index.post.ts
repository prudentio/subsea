import { prisma } from "../../utils/prisma";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    name: string;
    description?: string;
  }>(event);

  if (!body?.name || !body?.description) {
    throw createError({
      statusCode: 400,
      statusMessage: "Username and password are required",
    });
  }

  const existingUser = await prisma.role.findUnique({
    where: { name: body.name },
    select: { id: true },
  });

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: "Name already exists",
    });
  }
  const createdBy = event.context.user?.sub ?? null;
  const id = crypto.randomUUID();

  const user = await prisma.role.create({
    data: {
      id:id,
      name: body.name,
      description: body.description,
      createdBy
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
    },
  });

  return {
    success: true,
    data: {
      message: "Role created successfully",
      user,
    },
  };
});
