import { Response, Request } from 'express'
import { OrderStatus } from '../models/orderStatus'
import * as _ from 'lodash'
import { OrderModel } from '../schemas/order.schema'
import { formatOutput } from '../utils/response.format'
import { UserModel } from '../schemas/user.schema'

const LENGTH_DEFAULT = 10

export const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params
  const order = await OrderModel.findById(id)
  if (!order) {
    return res.status(404).send()
  }

  return formatOutput(res, order, 200, 'order')
}

export const getAllOrders = async (req: Request, res: Response) => {
  const limit = parseInt(req.params.limit, 10) || LENGTH_DEFAULT
  const offset = parseInt(req.params.offset, 10) || 0

  const orders = await OrderModel.find({}, null, { skip: offset, limit })
  return formatOutput(res, orders, 200, 'order')
}

export const addOrder = async (req: Request, res: Response) => {
  const { userId } = req.body
  const user = await UserModel.findById(userId)
  if (!user) {
    return res.status(404).send()
  }

  const order = new OrderModel(req.body)
  await order.save()

  return formatOutput(res, order, 201, 'order')
}

export const removeOrder = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const order = await OrderModel.findById(id)
  if (!order) {
    return res.status(404).send()
  }
  await order.remove()
  return res.status(204).send()
}

export const getInventory = async (req: Request, res: Response) => {
  const { status } = req.query
  const orders = await OrderModel.find({ status })
  const listOrders = _.groupBy(orders, 'userId')

  return formatOutput(res, listOrders, 200, 'inventory')
}
