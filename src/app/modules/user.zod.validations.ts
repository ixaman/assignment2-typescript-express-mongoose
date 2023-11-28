import z from 'zod'

const userNameValidationSchema = z.object({
  firstName: z.string().min(1, { message: 'FirstName is required' }),
  lastName: z.string().min(1, { message: 'LastName is required' }),
})

const addressValidationSchema = z.object({
  street: z.string().min(1, { message: 'Street is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
})

export const orderValidationSchema = z.object({
  productName: z.string().min(1, { message: 'ProductName is required' }),
  price: z.number().min(1, { message: 'Price is required' }),
  quantity: z.number().min(1, { message: 'Quantity is required' }),
})

export const userValidationSchema = z.object({
  userId: z.number().min(1, { message: 'UserId is required' }),
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  fullName: userNameValidationSchema,
  age: z.number().min(1, { message: 'Age is required' }),
  email: z.string().email().min(1, { message: 'Email is required' }),
  isActive: z.boolean(),
  hobbies: z.array(z.string()).refine((data) => data.length > 0, {
    message: 'Must have one or more hobbies',
  }),
  address: addressValidationSchema,
  orders: z.array(orderValidationSchema).optional(), // Make orders optional
})
