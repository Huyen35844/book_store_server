import { model, Schema } from "mongoose";

const FavoriteSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true }
}, { timestamps: true })

const FavoriteModel = model("Favorite", FavoriteSchema)
export default FavoriteModel