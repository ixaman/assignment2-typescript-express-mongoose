import { Request, Response } from 'express'
import { UserServices } from './user.services'
import User from './user.model'
import { TOrder, TUser } from './user.interface'
import {
  orderValidationSchema,
  userValidationSchema,
} from './user.zod.validations'

const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body

    //validate using zod
    const zodParsedData = userValidationSchema.parse(userData)

    const result = await UserServices.createUserIntoDb(zodParsedData)
    //again making query to get the saved user and removing the password field
    const savedUserWithoutPass = await User.findOne({
      userId: result.userId,
    }).select('-_id -password -fullName._id -address._id -orders')

    res.status(200).json({
      success: true,
      message: 'User created successfully!',
      data: savedUserWithoutPass,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: {
        code: 500,
        description: error,
      },
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

    if (await User.isExist(userId)) {
      res.status(200).json({
        success: true,
        message: 'User data retrieved!',
        data: userData,
      })
    } else {
      throw new Error('User not found in db!')
    }
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

const handleUpdateUser = async (req: Request, res: Response) => {
  try {
    const { userId: uId } = req.params
    const userId = Number(uId)
    const updateData: TUser = req.body

    if (await User.isExist(userId)) {
      const zodParsedData = userValidationSchema.parse(updateData)
      const updatedUser = await UserServices.updateUser(userId, zodParsedData)
      res.status(200).json({
        success: true,
        message: 'User updated successfully!',
        data: updatedUser,
      })
    } else {
      throw new Error('User not found in db!')
    }
  } catch (error: any) {
    console.log(error)
    if (error.errors) {
      res.status(404).json({
        success: false,
        message: 'Something Went Wrong',
        error: {
          code: 404,
          description: error.errors,
        },
      })
    } else {
      res.status(404).json({
        success: false,
        message: error.message,
        error: {
          code: 404,
          description: error.errors || 'User not found!',
        },
      })
    }
  }
}

const handleDeleteUser = async (req: Request, res: Response) => {
  try {
    const { userId: uId } = req.params
    const userId = Number(uId)
    if (await User.isExist(userId)) {
      const result = await UserServices.deleteUser(userId)
      if (result.deletedCount === 1) {
        res.status(200).json({
          success: true,
          message: 'User deleted successfully!',
          data: null,
        })
      }
    } else {
      throw new Error('User not found!')
    }
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

const handleCreateOrder = async (req: Request, res: Response) => {
  try {
    const { userId: uId } = req.params
    const userId = Number(uId)
    const product: TOrder = req.body
    if (await User.isExist(userId)) {
      const zodParsedData = orderValidationSchema.parse(product)
      const result = await UserServices.addProductToOrder(userId, zodParsedData)
      if (result.acknowledged == true) {
        res.status(500).json({
          success: true,
          message: 'Order created successfully!',
          data: null,
        })
      }
    } else {
      throw new Error('User not found in db!')
    }
  } catch (error: any) {
    if (error.errors) {
      res.status(404).json({
        success: false,
        message: 'Something Went Wrong',
        error: {
          code: 404,
          description: error.errors,
        },
      })
    } else {
      res.status(404).json({
        success: false,
        message: error.message,
        error: {
          code: 404,
          description: error.errors || 'User not found!',
        },
      })
    }
  }
}

const handleGetOrdersOfUser = async (req: Request, res: Response) => {
  try {
    const { userId: uId } = req.params
    const userId = Number(uId)
    if (await User.isExist(userId)) {
      const result = await UserServices.getOrdersOfUser(userId)

      res.status(200).json({
        success: true,
        message: 'Order fetched successfully!',
        data: result,
      })
    } else {
      throw new Error('User not found!')
    }
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

const handleGetTotalPriceOfSpecificUser = async (
  req: Request,
  res: Response,
) => {
  try {
    const { userId: uId } = req.params
    const userId = Number(uId)
    if (await User.isExist(userId)) {
      const result = await UserServices.getTotalPriceOfSpecificOrder(userId)

      res.status(200).json({
        success: true,
        message: 'Total price calculated successfully!',
        data: result,
      })
    } else {
      throw new Error('User not found!')
    }
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
  handleUpdateUser,
  handleDeleteUser,
  handleCreateOrder,
  handleGetOrdersOfUser,
  handleGetTotalPriceOfSpecificUser,
}
