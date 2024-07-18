import { sendErrorRes } from "../utils/sendErrorRes.js"
import * as yup from "yup"
const validate = (schema) => {
    return async (req, res, next) => {
        //set abortEarly as true, yup catchs the error not in order
        //set abortEarly as false, yup catchs all the error at once (5 errors occurs)
        //set inner[0] to only get the first error yup catch to solve this problem
        try {
            await schema.validate(

                { ...req.body },
                //strict (true) means: schema (age, name) but data (age, name, hobby) => fine
                //abortEarly (true): return at once when an error occurs
                { strict: true, abortEarly: true }
            )
            next()
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return sendErrorRes(res, error.message, 400)
            } else {
                next(error)
            }
        }
    }
}

export default validate

/**
 * nhận tham số duy nhất là schema
 * vì là middleware function nên endpoint file vẫn cần sử dụng đến đoạn async(req, res) nên cần return đoạn đó
 * do là middleware nên có thêm next
 * dùng try catch để bắt lỗi riêng cho yup
 * schema.validate(req.body, options)
 * validate xong next() đến các nhiệm vụ tiếp
 * catch nếu là lỗi từ yup thì thông báo sendErrorRes
 * ngược lại thì next(error) cho bên async express error xử lí lỗi 
 */