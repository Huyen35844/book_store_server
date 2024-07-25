import FavoriteModel from "../models/FavoriteModel.js"

export const addToFavorite = async (req, res) => {
    const { owner, productId } = req.body

    const product = await FavoriteModel.findOne({ owner, productId })

    if (product) return res.json("This product has already added to favorite!")
    else
        await FavoriteModel.create({ owner, productId })

    res.json("Add to favorite successfully!")
}

export const getFavoriteList = async (req, res) => {
    const { owner } = req.params

    const products = await FavoriteModel.find({ owner }).populate("productId")

    const list = products.map((p) => {
        return {
            id: p._id,
            productId: p.productId._id,
            images: p.productId.images?.map((i) => i.url),
            category: p.productId.category,
            name: p.productId.name,
            quantity: p.productId.quantity,
            price: p.productId.price,
            description: p.productId.description
        }
    })

    res.json({ list })
}

export const deleteFavorite = async (req, res) => {
    const { productId } = req.params
    await FavoriteModel.deleteOne({ productId })
    res.json("Deleted successfully")
}

export const isInFavorite = async (req, res) => {
    const { productId, owner } = req.body
    
    const favorite = await FavoriteModel.findOne({ owner, productId })
    if (favorite) { res.json({ result: true }) }
    else {
        res.json({ result: false })
    }
}