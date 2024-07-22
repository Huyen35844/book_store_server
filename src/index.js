import 'dotenv/config'
import express from 'express'
import authRouter from './routes/auth.js'
import productRouter from './routes/product.js'
import "express-async-errors"
import "./db/index.js"
import cartRouter from './routes/cart.js'
import invoiceRouter from './routes/invoice.js'

const app = express()
app.use(express.static("src/public"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/auth", authRouter)
app.use("/product", productRouter)
app.use("/cart", cartRouter)
app.use("/invoice", invoiceRouter)

//catch the error if something wrong during the process to avoid repeating try catch block (express-async-error)
app.use(function (err, req, res, next) {
    res.status(500).json({ message: err.message })
})

app.listen(8000, () => {
    console.log('The app is running on http://localhost:8000');
})

/**
 * Sử dụng express nên là app = express()
 * dùng middleware của express để chuyển đổi dữ liệu từ client json() sang đối tượng javascript gắn vào req.body
 * dùng middleware của express để chuyển đổi dữ liệu từ client urlencoded() sang đối tượng javascript gắn vào req.body
 * khai báo các router
 * xử lí lỗi trong quá trình một lần duy nhất bằng cách sử dụng express-async-error
 * app.listen khai báo port và callback thông báo đang chạy
 * kết nối với db mongo đơn giản bằng cách import
 * thêm import cho thư viện dotenv trên cùng
 * thêm express.static() để tải các thành phần html, css lên
 */
