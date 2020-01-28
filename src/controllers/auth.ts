import { Response, Request } from 'express'
import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from '../schemas/user.schema'
import { OrderAPILogger } from '../utils/logger'

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.query
  OrderAPILogger.logger.info(
    `[GET] [/users/login] nouser found with the username ${username}`
  )
  const user = await UserModel.findOne({ username })

  if (!user) {
    return res.status(404).send()
  }

  const validate = bcrypt.compareSync(password, user.password.valueOf())
  if (validate) {
    const payload = { _id: user._id, email: user.email }
    const token = jwt.sign(payload, 'TOP_SECRET')
    return res.json({ token })
  }

  OrderAPILogger.logger.info(
    `[GET] [/users/login] user not authorized ${username}`
  )
  return res.status(401).send()
}
