import { model, Schema } from "mongoose";
import { categories } from "../utils/categories.js";

const ProductSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
        type: String,
        enum: [...categories],
        required: true,
    },
    quantity: { type: Number, required: true },
    images: [
        {
            type: Object,
            url: String,
            id: String,
        },
    ],
}, { timestamps: true })

const ProductModel = model("Product", ProductSchema)
export default ProductModel






