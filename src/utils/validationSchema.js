import { isValidObjectId } from 'mongoose';
import * as yup from 'yup'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/;


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
            message: "Invalid user id",
            test: (value) => {
                return isValidObjectId(value)
            }
        })
}

export const signUpSchema = yup.object({
    ...name,
    ...email,
    ...password
})

export const verifyEmailSchema = yup.object({
    ...id,
    ...token
})

/**
 * import * as yup để khi sử dụng bất kì thứ gì trong yup chỉ cần yup.   còn không phải import từng cái rất lâu
 * cấu trúc yup.object({})
 * tạo các object riêng cho từng thuộc tính muốn kiểm tra
 * mỗi object có tên riêng ví dụ password: yup.string()
 * 
 */