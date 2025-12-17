import { Prisma } from '@prisma/client/extension'
import { prisma } from '../../utils/prisma'


interface UserProfileRole {
  id: string
  username: string
  name: string | null
  isSuperuser: boolean
  roles: {role:{id:string,name:string}}[]
  createdBy: string | null
  createdAt: Date
  updatedAt: Date | null
}


interface UserProfileResponse {
  id: string
  username: string
  name: string | null
  isSuperuser: boolean
  rolesId: string[]
  rolesName: string[]
  createdBy: string | null
  createdAt: Date
  updatedAt: Date | null
}

export default defineEventHandler(async () => {
  const listUser: UserProfileRole[] =
    await prisma.userAccount.findMany({
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

  if (!listUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }


  const response: UserProfileResponse[] = listUser.map((user)=>{
    return {
        id: user.id,
        username: user.username,
        name: user.name,
        isSuperuser: user.isSuperuser,
        rolesId: user.roles.map(r => r.role.id),
        rolesName: user.roles.map(r => r.role.name),
        createdBy: user.createdBy,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } 
  }) 

  return {
    success: true,
    data: response,
  }
})
