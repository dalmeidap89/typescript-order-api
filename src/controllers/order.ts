import { Response, Request, NextFunction } from 'express'
import * as _ from 'lodash'
import { OrderModel } from '../schemas/order.schema'
import { formatOutput } from '../utils/response.format'
import { UserModel } from '../schemas/user.schema'
import { OrderAPILogger } from '../utils/logger'

const LENGTH_DEFAULT = 10

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params
  OrderAPILogger.logger.info(`[GET] [/store/orders/] ${id}`)

  const order = await OrderModel.findById(id)
  if (!order) {
    OrderAPILogger.logger.info(
      `[GET] [/store/orders/:{orderId}] Order ${id} not found.`
    )
    return next(new Error(`Order ${id} not found.`))
  }

  return formatOutput(res, order, 200, 'order')
}

export const getAllOrders = async (req: Request, res: Response) => {
  const limit = parseInt(req.params.limit, 10) || LENGTH_DEFAULT
  const offset = parseInt(req.params.offset, 10) || 0

  OrderAPILogger.logger.info(`[GET] [/store/orders/]`)
  const orders = await OrderModel.find({}, null, { skip: offset, limit })
  return formatOutput(res, orders, 200, 'order')
}

export const addOrder = async (req: Request, res: Response) => {
  const { userId } = req.body

  OrderAPILogger.logger.info(`[POST] [/store/orders/] ${userId}`)
  const user = await UserModel.findById(userId)
  if (!user) {
    OrderAPILogger.logger.info(
      `[POST] [/store/orders/] There is no user with the userId ${userId}`
    )
    throw new Error(`There is no user with the userId ${userId}`)
  }

  const order = new OrderModel(req.body)
  OrderAPILogger.logger.info(`[POST] [/store/orders/] ${order}`)
  await order.save()

  return formatOutput(res, order, 201, 'order')
}

export const removeOrder = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  OrderAPILogger.logger.warn(`[DELETE] [/store/orders/] ${id}`)

  const order = await OrderModel.findById(id)
  if (!order) {
    OrderAPILogger.logger.warn(
      `[DELETE] [/store/orders/:{orderId}] Order id ${id} not found`
    )
    return res.status(404).send()
  }
  await order.remove()
  return res.status(204).send()
}

export const getInventory = async (req: Request, res: Response) => {
  const { status } = req.query
  OrderAPILogger.logger.info(`[GET] [/store/inventory/] ${status}`)
  const orders = await OrderModel.find({ status })
  const listOrders = _.groupBy(orders, 'userId')

  return formatOutput(res, listOrders, 200, 'inventory')
}
