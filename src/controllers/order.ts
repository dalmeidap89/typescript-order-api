import { Response, Request } from 'express'
import * as _ from 'lodash'
import Order from '../models/order'
import { OrderStatus } from '../models/orderStatus'

let orders: Array<Order> = []

export const getOrder = (req: Request, res: Response) => {
  const { id } = req.params
  const order = orders.find(obj => obj.id === Number(id))
  const httpStatusCode = order ? 200 : 404
  return res.status(httpStatusCode).send(order)
}

export const getAllOrders = (req: Request, res: Response) => {
  const limit = parseInt(req.params.limit, 10) || orders.length
  const offset = parseInt(req.params.offset, 10) || 0

  const ordersFilteres = _.chain(orders)
    .drop(offset)
    .take(limit)
    .value()
  return res.status(200).send(ordersFilteres)
}

export const addOrder = (req: Request, res: Response) => {
  const order: Order = {
    // generic random value from 1 to 100 only for tests so far
    id: Math.floor(Math.random() * 100) + 1,
    userId: req.body.userId,
    quantity: req.body.quantity,
    shipDate: req.body.shipDate,
    status: OrderStatus.Placed,
    complete: false,
  }
  orders.push(order)
  return res.status(201).send(order)
}

export const removeOrder = (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const orderIndex = orders.findIndex(item => item.id === id)
  if (orderIndex === -1) {
    return res.status(404).send()
  }
  orders = orders.filter(item => item.id !== id)
  return res.status(204).send()
}

export const getInventory = (req: Request, res: Response) => {
  const { status } = req.query
  let inventoryOrders = orders
  if (status) {
    inventoryOrders = inventoryOrders.filter(order => order.status === status)
  }

  const groupedOrders = _.groupBy(inventoryOrders, 'userId')
  return res.status(200).send(groupedOrders)
}
