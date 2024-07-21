import { model, Schema } from "mongoose";

const CartSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    amount: { type: Number, required: true },
}, { timestamps: true })

const CartModel = model("Cart", CartSchema)
export default CartModel