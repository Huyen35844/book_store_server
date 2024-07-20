import ProductModel from "../models/productModel.js"

export const getLatestProducts = async (req, res) => {
    const { limit = "10", page = "1" } = req.query
    const products = await ProductModel.find().sort("createdAt").skip((+page - 1) * +limit).limit(+limit)
    const list = products.map((p) => {
        return {
            id: p._id,
            name: p.name,
            thumbnail: p.thumbnail,
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
            thumbnail: p.thumbnail,
            category: p.category,
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
            thumbnail: p.thumbnail,
            category: p.category,
            quantity: p.quantity,
            price: p.price,
            description: p.description
        }
    })
    res.json({ products: list })
}

