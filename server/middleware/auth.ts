import jwt from 'jsonwebtoken'
export interface AuthPayload {
  sub: string
  username: string
  isSuperuser: boolean
}

const JWT_SECRET = process.env.JWT_SECRET

export default defineEventHandler((event) => {
  const url = event.node.req.url || ''

  if (url.startsWith('/api/auth') || !url.startsWith('/api')) {
    return
  }

  const auth = getRequestHeader(event, 'authorization')

 const token = auth?.split(' ')[1]
 const decoded = jwt.verify(token!, JWT_SECRET!) as AuthPayload
 if (!decoded?.sub) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }


if (!auth?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  event.context.user = decoded
})