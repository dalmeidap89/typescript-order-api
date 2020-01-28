import { Response, Request } from 'express'
import bcrypt from 'bcrypt'
import { UserModel } from '../schemas/user.schema'
import { formatOutput } from '../utils/response.format'
import { OrderAPILogger } from '../utils/logger'

export const getUser = async (req: Request, res: Response) => {
  const { username } = req.params

  OrderAPILogger.logger.info(`[GET] [/users] ${username}`)
  let user = await UserModel.findOne({ username })
  if (!user) {
    OrderAPILogger.logger.info(
      `[GET] [/users/:{username}] user with username ${username} not found`
    )
    return res.status(404).send()
  }

  user = user.toJSON()
  user._id = user._id.toString()

  return formatOutput(res, user, 200, 'user')
}

export const addUser = async (req: Request, res: Response) => {
  let newUser
  try {
    newUser = new UserModel(req.body)
    OrderAPILogger.logger.info(`[POST] [/users] ${newUser}`)

    newUser.password = bcrypt.hashSync(newUser.password, 10)
    const user = await newUser.save()
    return formatOutput(res, user, 201, 'user')
  } catch (e) {
    OrderAPILogger.logger.info(
      `[POST] [/users] something went wrong when saving a new user ${newUser.username} | ${e.message}`
    )
    throw new Error(e)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const { username } = req.params
  OrderAPILogger.logger.info(`[PATCH] [/users] ${username}`)

  const user = await UserModel.findOne({ username })
  if (!user) {
    OrderAPILogger.logger.info(
      `[PATCH] [/users/:{username}] user with username ${username} not found`
    )
    return res.status(404).send()
  }

  user.username = req.body.username || user.username
  user.firstName = req.body.firstName || user.firstName
  user.lastName = req.body.lastName || user.lastName
  user.email = req.body.email || user.email
  user.password = req.body.password || user.password
  user.phone = req.body.phone || user.phone
  user.userStatus = req.body.userStatus || user.userStatus

  await user.save()
  return res.status(204).send()
}

export const removeUser = async (req: Request, res: Response) => {
  const { username } = req.params
  OrderAPILogger.logger.warn(`[DELETE] [/users] ${username}`)

  const user = UserModel.findOne({ username })
  if (!user) {
    OrderAPILogger.logger.info(
      `[DELETE] [/users/:{username}] user with username ${username} not found`
    )
    return res.status(404).send()
  }

  await user.remove()
  return res.status(204).send()
}
