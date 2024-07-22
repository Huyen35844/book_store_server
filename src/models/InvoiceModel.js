import { model, Schema } from "mongoose";

const InvoiceSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            amount: { type: Number, required: true },
        }
    ],
    total: { type: Number, required: true },
}, { timestamps: true })

const InvoiceModel = model("Invoice", InvoiceSchema)
export default InvoiceModel