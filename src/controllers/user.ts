import { Response, Request } from 'express'
import { User } from '../models/user'

let users: Array<User> = []

export const getUser = (req: Request, res: Response) => {
  const { username } = req.params
  const user = users.find(obj => obj.username === username)
  const httpStatusCode = user ? 200 : 404
  return res.status(httpStatusCode).send(user)
}

export const addUser = (req: Request, res: Response) => {
  const user: User = {
    // generic random value from 1 to 100 only for tests so far
    id: Math.floor(Math.random() * 100) + 1,
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    userStatus: 1,
  }

  users.push(user)
  return res.status(201).send(user)
}

export const updateUser = (req: Request, res: Response) => {
  const { username } = req.params
  const userIndex = users.findIndex(item => item.username === username)
  if (userIndex === -1) {
    return res.status(404).send()
  }
  const user = users[userIndex]
  user.username = req.body.username || user.username
  user.firstName = req.body.firstName || user.firstName
  user.lastName = req.body.lastName || user.lastName
  user.email = req.body.email || user.email
  user.password = req.body.password || user.password
  user.phone = req.body.phone || user.phone
  user.userStatus = req.body.userStatus || user.userStatus
  users[userIndex] = user
  // set Code only
  return res.status(204).send()
}

export const removeUser = (req: Request, res: Response) => {
  const { username } = req.params
  const userIndex = users.findIndex(item => item.username === username)
  if (userIndex === -1) {
    return res.status(404).send()
  }
  users = users.filter(item => item.username !== username)
  return res.status(204).send()
}
