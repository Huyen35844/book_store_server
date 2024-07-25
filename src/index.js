import 'dotenv/config'
import express from 'express'
import authRouter from './routes/auth.js'
import productRouter from './routes/product.js'
import "express-async-errors"
import "./db/index.js"
import cartRouter from './routes/cart.js'
import invoiceRouter from './routes/invoice.js'
import favoriteRouter from './routes/favorite.js'

const app = express()
app.use(express.static("src/public"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/auth", authRouter)
app.use("/product", productRouter)
app.use("/cart", cartRouter)
app.use("/invoice", invoiceRouter)
app.use("/favorite", favoriteRouter)

//catch the error if something wrong during the process to avoid repeating try catch block (express-async-error)
app.use(function (err, req, res, next) {
    res.status(500).json({ message: err.message })
})

app.listen(8000, () => {
    console.log('The app is running on http://localhost:8000');
})


