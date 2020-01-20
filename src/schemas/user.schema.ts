import { Document, Model, model, Schema } from 'mongoose'
import { User } from '../models/user'

export interface UserModel extends User, Document {
  _id: string
}

export const UserSchema: Schema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phone: String,
  userStatus: Number,
  username: String,
})

export const UserModel: Model<UserModel> = model<UserModel>('User', UserSchema)
