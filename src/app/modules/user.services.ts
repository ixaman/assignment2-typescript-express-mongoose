import { TOrder, TUser } from './user.interface'
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
  const result = await User.findOne({ userId: id }).select(
    '-_id -password -fullName._id -address._id -orders',
  )
  return result
}

const updateUser = async (id: number, user: TUser) => {
  const result = await User.findOneAndUpdate({ userId: id }, user, {
    new: true,
  }).select('-_id -password -fullName._id -address._id -orders')
  return result
}

const deleteUser = async (id: number) => {
  const result = await User.deleteOne({ userId: id })
  return result
}

const addProductToOrder = async (id: number, product: TOrder) => {
  const result = await User.updateOne(
    { userId: id },
    { $push: { orders: product } },
  )
  return result
}

const getOrdersOfUser = async (id: number) => {
  const result = await User.findOne({ userId: id }, { orders: 1, _id: 0 })
  return result
}

const getTotalPriceOfSpecificOrder = async (id: number) => {
  const result = await User.aggregate([
    // stage: 1 of aggregation
    { $match: { userId: id } },

    // stage: 2 of aggregation
    { $unwind: '$orders' },

    // stage: 3 of aggregation
    {
      $group: {
        _id: null,
        totalPrice: { $sum: '$orders.price' }, // Assuming 'price' is the field in each order representing the price
      },
    },

    // stage: 4 of aggregation
    {
      $project: {
        _id: 0,
        totalPrice: 1,
      },
    },
  ])

  return result
}

export const UserServices = {
  createUserIntoDb,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  addProductToOrder,
  getOrdersOfUser,
  getTotalPriceOfSpecificOrder,
}
