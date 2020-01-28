import { Document, Model, model, Schema } from 'mongoose'
import Order from '../models/order'

export interface OrderModel extends Order, Document {
  _id: string
}

export const OrderSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  quantity: Number,
  shipDate: Date,
  status: { type: String, enum: ['PLACED', 'APROVED', 'DELIVERED'] },
  complete: Boolean,
})
export const OrderModel: Model<OrderModel> = model<OrderModel>('Order', OrderSchema)
