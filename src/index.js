import express from 'express'
import authRouter from './routes/auth.js'
import productRouter from './routes/product.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/auth", authRouter)
app.use("/product", productRouter)

app.listen(8000, () => {
    console.log('The app is running on http://localhost:8000');
})