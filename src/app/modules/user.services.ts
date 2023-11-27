import { TUser } from './user.interface'
import User from './user.model'

const createUserIntoDb = async (user: TUser) => {
  const result = await User.create(user)
  return result
}

const getUsers = async () => {
  const result = await User.find(
    {},
    {
      username: 1,
      'fullName.firstName': 1,
      'fullName.lastName': 1,
      age: 1,
      email: 1,
      'address.street': 1,
      'address.city': 1,
      'address.country': 1,
      _id: 0,
    },
  ).select('-fullName._id -address._id')
  return result
}

const getSingleUser = async (id: number) => {
  const result = await User.findOne({ userId: id })
  return result
}

export const UserServices = {
  createUserIntoDb,
  getUsers,
  getSingleUser,
}