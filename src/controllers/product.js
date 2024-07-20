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
            price: p.price,
            description: p.description
        }
    })

    res.json({ products: list })
}




