import express from 'express'
import { UsersControllers } from './user.controllers'

const router = express.Router()

// will call controller here
router.post('/create-user', UsersControllers.handleCreateUser)
router.get('/', UsersControllers.handleGetUsers)
router.get('/:userId', UsersControllers.handleGetSingleUser)
router.put('/:userId', UsersControllers.handleUpdateUser)

export const UserRouters = router
