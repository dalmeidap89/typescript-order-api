import { OrderStatus } from './orderStatus'

export default interface Order {
  _id: string
  userId: number
  quantity: number
  shipDate: Date
  status: OrderStatus
  complete: boolean
}
