import { Model } from 'mongoose'

export type TUserName = {
  firstName: string
  lastName: string
}

export type TAddress = {
  street: string
  city: string
  country: string
}

export type TOrder = {
  productName: string
  price: number
  quantity: number
}

export type TUser = {
  userId: number
  username: string
  password: string
  fullName: TUserName
  age: number
  email: string
  isActive: boolean
  hobbies: Array<string>
  address: TAddress
  orders?: Array<TOrder>
}

// static method type to check if user already exist in db
export interface UserModel extends Model<TUser> {
  isExist(id: number): Promise<TUser | null>
}
