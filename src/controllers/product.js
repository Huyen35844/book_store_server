import { isValidObjectId } from "mongoose"
import ProductModel from "../models/productModel.js"
import { sendErrorRes } from "../utils/sendErrorRes.js"

export const getLatestProducts = async (req, res) => {
    const { limit = "10", page = "1" } = req.query

    const products = await ProductModel.find().sort("createdAt").skip((+page - 1) * +limit).limit(+limit)

    const list = products.map((p) => {
        return {
            id: p._id,
            name: p.name,
            images: p.images?.map((i) => i.url),
            category: p.category,
            quantity: p.quantity,
            price: p.price,
            description: p.description
        }
    })

    res.json({ products: list })
}

export const getProductsByCategory = async (req, res) => {
    const category = req.params.category

    const products = await ProductModel.find({ category })

    const list = products.map((p) => {
        return {
            id: p._id,
            name: p.name,
            category: p.category,
            images: p.images?.map((i) => i.url),
            quantity: p.quantity,
            price: p.price,
            description: p.description
        }
    })

    res.json({ products: list })
}

export const searchProduct = async (req, res) => {
    const name = req.query.name

    const regex = new RegExp(name, 'i')
    const products = await ProductModel.find({ name: regex }).limit(50)

    const list = products.map((p) => {
        return {
            id: p._id,
            name: p.name,
            category: p.category,
            images: p.images?.map((i) => i.url),
            quantity: p.quantity,
            price: p.price,
            description: p.description
        }
    })
    res.json({ products: list })
}

export const getDetailProductById = async (req, res) => {
    const id = req.params.id

    if (!isValidObjectId(id)) return sendErrorRes(res, "Invalid product id!", 400)

    const product = await ProductModel.findById(id)
    if (!product) return sendErrorRes(res, "Couldn't find the product!", 400)
        
    res.json({
        id: product._id,
        name: product.name,
        category: product.category,
        images: product.images?.map((i) => i.url),
        quantity: product.quantity,
        price: product.price,
        description: product.description
    })
}
