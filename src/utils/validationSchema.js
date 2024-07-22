import { isValidObjectId } from 'mongoose';
import * as yup from 'yup'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/;
const phoneNumberRegex = /^(?:\+84|0)(?:\d{9}|\d{8})$/;

const password = {
    password: yup
        .string()
        .required("Password is missing!")
        .min(8, "Password should be at least 8 chars long!")
        .matches(passwordRegex, "Password is too simple!")
}

const email = {
    email: yup
        .string()
        .required("Email is missing!")
        .matches(emailRegex, "Email is not valid!")
}

const name = {
    name: yup
        .string()
        .required("Name is missing!")
}

const token = {
    token: yup.string().required("Token is missing!")
}

const id = {
    id: yup
        .string()
        .test({
            name: "valid-id",
            message: "Invalid id",
            test: (value) => {
                return isValidObjectId(value)
            }
        })
}

const phoneNumber = {
    phoneNumber: yup.string().required("Phone number is missing!").matches(phoneNumberRegex, "Phone number is invalid!")
}

const address = {
    address: yup
        .string()
        .required("Address is missing!")
}

export const signUpSchema = yup.object({
    ...name,
    ...email,
    ...password
})

export const verifyTokenSchema = yup.object({
    ...id,
    ...token
})

export const resetPasswordSchema = yup.object({
    ...id,
    ...token,
    ...password
})

export const updateProfileSchema = yup.object({
    ...name,
    ...address,
    ...phoneNumber
})

export const cartValidationSchema = yup.object({
    owner: yup
        .string()
        .required("Owner is required")
        .test({
            name: "valid-id",
            message: "Invalid id",
            test: (value) => {
                return isValidObjectId(value)
            }
        }),
    productId: yup
        .string()
        .required("Product id is required")
        .test({
            name: "valid-id",
            message: "Invalid id",
            test: (value) => {
                return isValidObjectId(value)
            }
        }),
    amount: yup.number().required("Amount is required").positive().integer(),
});

export const InvoiceSchema = yup.object({
    owner: yup
        .string()
        .required("Owner is required")
        .test({
            name: "valid-id",
            message: "Invalid id",
            test: (value) => {
                return isValidObjectId(value)
            }
        }),
    products: yup.array().required('Products are required'),
    total: yup.number().required('Total is required').positive('Total must be positive')
})

export const FavoriteSchema = yup.object({
    owner: yup
        .string()
        .required("Owner is required")
        .test({
            name: "valid-id",
            message: "Invalid id",
            test: (value) => {
                return isValidObjectId(value)
            }
        }),
    productId: yup
        .string()
        .required("Product id is required")
        .test({
            name: "valid-id",
            message: "Invalid id",
            test: (value) => {
                return isValidObjectId(value)
            }
        }),
})






/**
 * import * as yup để khi sử dụng bất kì thứ gì trong yup chỉ cần yup.   còn không phải import từng cái rất lâu
 * cấu trúc yup.object({})
 * tạo các object riêng cho từng thuộc tính muốn kiểm tra
 * mỗi object có tên riêng ví dụ password: yup.string()
 * 
 */