import express from 'express'
import { UsersControllers } from './user.controllers'

const router = express.Router()

// will call controller here
router.post('/', UsersControllers.handleCreateUser)
router.get('/', UsersControllers.handleGetUsers)
router.get('/:userId', UsersControllers.handleGetSingleUser)
router.put('/:userId', UsersControllers.handleUpdateUser)
router.delete('/:userId', UsersControllers.handleDeleteUser)
router.put('/:userId/orders', UsersControllers.handleCreateOrder)
router.get('/:userId/orders', UsersControllers.handleGetOrdersOfUser)
router.get(
  '/:userId/orders/total-price',
  UsersControllers.handleGetTotalPriceOfSpecificUser,
)

export const UserRouters = router
