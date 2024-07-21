import CartModel from "../models/CartModel.js"

export const addToCart = async (req, res) => {
    const { owner, productId, amount } = req.body
    const existProductInCart = await CartModel.findOne({ productId })
    if (existProductInCart) {
        existProductInCart.amount += amount
        existProductInCart.save()
    } else {
        await CartModel.create({ owner, productId, amount })
    }
    res.json({ message: "Add to cart successfully!" })
}

export const deleteProductFromCart = async (req, res) => {
    const { id } = req.body
    await CartModel.findByIdAndDelete(id)
    res.json({ message: "Delete the product successfully" })
}

export const updateCart = async (req, res) => {
    const { amount, cartId } = req.body
    await CartModel.findByIdAndUpdate(cartId, { amount })
    res.json({ message: "Update the product successfully" })
}

export const getCartByUser = async (req, res) => {
    const { owner } = req.params
    const carts = await CartModel.find({ owner }).populate("productId")
    console.log(carts);
    const list = carts.map((c) => {
        return {
            id: c._id,
            productId: c.productId._id,
            owner: c.owner,
            amount: c.amount,
            name: c.productId.name,
            quantity: c.productId.quantity,
            category: c.productId.category,
            image: c.productId.images[0].url,
            price: c.productId.price
        }
    })
    res.json({ list })
}