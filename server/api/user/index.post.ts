import { prisma } from "../../utils/prisma";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    username: string;
    password: string;
    name?: string;
    isSuperuser?: boolean;
  }>(event);

  if (!body?.username || !body?.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Username and password are required",
    });
  }

  const existingUser = await prisma.userAccount.findUnique({
    where: { username: body.username },
    select: { id: true },
  });

  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: "Username already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(body.password, 12);

  const createdBy = event.context.user?.sub ?? null;
  const id = crypto.randomUUID();

  const user = await prisma.userAccount.create({
    data: {
      id: id,
      username: body.username,
      name: body.name ?? null,
      password: hashedPassword,
      isSuperuser: body.isSuperuser ?? false,
      createdBy,
    },
    select: {
      id: true,
      username: true,
      name: true,
      isSuperuser: true,
      createdAt: true,
    },
  });

  return {
    success: true,
    data: {
      message: "User created successfully",
      user,
    },
  };
});
