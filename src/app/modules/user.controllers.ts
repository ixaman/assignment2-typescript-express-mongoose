import { Request, Response } from 'express'
import { UserServices } from './user.services'
import User from './user.model'

const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body
    const result = await UserServices.createUserIntoDb(userData)
    //again making query to get the saved user and removing the password field
    const savedUserWithoutPass = await User.findOne({
      userId: result.userId,
    }).select('-password -fullName._id -address._id')

    res.status(200).json({
      success: true,
      message: 'User created successfully!',
      data: savedUserWithoutPass,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'User not found',
    })
  }
}

const handleGetUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getUsers()
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully!',
      data: result,
    })
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: 'User not found',
      error: {
        code: 404,
        description: error.message || 'User not found',
      },
    })
  }
}

const handleGetSingleUser = async (req: Request, res: Response) => {
  try {
    const { userId: uId } = req.params
    const userId = Number(uId)
    const userData = await UserServices.getSingleUser(userId)

    res.status(200).json({
      success: true,
      message: 'User data retrieved!',
      data: userData,
    })
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: 'User not found!',
      error: {
        code: 404,
        description: error.message || 'User not found!',
      },
    })
  }
}

export const UsersControllers = {
  handleCreateUser,
  handleGetUsers,
  handleGetSingleUser,
}
