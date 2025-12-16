import { prisma } from '../../utils/prisma'

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    username: string
    password: string
  }>(event)

  if (!body?.username || !body?.password) {
    return {
      statusCode: 400,
      body: {
        success: false,
        message: 'Username and password are required',
      },
    }
  }
  const user = await prisma.userAccount.findUnique({
    where: { username: body.username },
  })

  if (!user || !user.password) {
    return {
      statusCode: 401,
      body: {
        success: false,
        message: 'Invalid username or password',
      },
    }
  }

  const isValid = await bcrypt.compare(body.password, user.password)

  if (!isValid) {
    return {
      statusCode: 401,
      body: {
        success: false,
        message: 'Invalid username or password',
      },
    }
  }

  const token = jwt.sign(
    {
      sub: user.id,
      username: user.username,
      isSuperuser: user.isSuperuser,
    },
    JWT_SECRET!,
    { expiresIn: '12h' }
  )

  return {
    statusCode: 200,
    body: {
      success: true,
      message: 'Login successful',
      tokenType: "Bearer",
      accessToken: token,
    },
  }
})
