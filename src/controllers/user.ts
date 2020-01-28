import { Response, Request } from 'express'
import bcrypt from 'bcrypt'
import { UserModel } from '../schemas/user.schema'
import { formatOutput } from '../utils/response.format'

export const getUser = async (req: Request, res: Response) => {
  const { username } = req.params

  let user = await UserModel.findOne({ username })
  if (!user) {
    return res.status(404).send()
  }

  user = user.toJSON()
  user._id = user._id.toString()

  return formatOutput(res, user, 200, 'user')
}

export const addUser = async (req: Request, res: Response) => {
  try {
    const newUser = new UserModel(req.body)
    newUser.password = bcrypt.hashSync(newUser.password, 10)
    const user = await newUser.save()
    return formatOutput(res, user, 201, 'user')
  } catch (e) {
    throw new Error(e)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const { username } = req.params
  const user = await UserModel.findOne({ username })
  if (!user) {
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
  const user = UserModel.findOne({ username })
  if (!user) {
    return res.status(404).send()
  }

  await user.remove()
  return res.status(204).send()
}
