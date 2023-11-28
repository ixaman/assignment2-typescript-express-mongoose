import { Schema, model } from 'mongoose'
import { TUser, UserModel } from './user.interface'
import bcrypt from 'bcrypt'
import config from '../config'

const userNameSchema = new Schema({
  firstName: { type: String, required: [true, 'FirstName is required'] },
  lastName: { type: String, required: [true, 'lastName is required'] },
})

const addressSchema = new Schema({
  street: { type: String, required: [true, 'Street is required'] },
  city: { type: String, required: [true, 'City is required'] },
  country: { type: String, required: [true, 'Country is required'] },
})

const orderSchema = new Schema({
  productName: { type: String, required: [true, 'productName is required'] },
  price: { type: Number, required: [true, 'price is required'] },
  quantity: { type: Number, required: [true, 'Quantity is required'] },
})

const userSchema = new Schema<TUser, UserModel>({
  userId: {
    type: Number,
    required: [true, 'UserId is required'],
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  password: { type: String, required: [true, 'Password is required'] },
  fullName: { type: userNameSchema, required: [true, 'FullName is required'] },
  age: { type: Number, required: [true, 'age is required'] },
  email: { type: String, required: [true, 'email is required'] },
  isActive: { type: Boolean, required: [true, 'isActive is required'] },
  hobbies: {
    type: [String],
    required: [true, 'Must have one or more hobbies'],
  },
  address: { type: addressSchema, required: [true, 'Address is required'] },
  orders: { type: [orderSchema] },
})

// static method to check if user already exist in db
userSchema.static('isExist', async function isExist(id: number) {
  const existingUser = await User.findOne({ userId: id })
  return existingUser
})
// middlewere to hash password before savnig
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_round),
  )
  next()
})

const User = model<TUser, UserModel>('User', userSchema)

export default User
