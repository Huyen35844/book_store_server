import InvoiceModel from "../models/InvoiceModel.js"

export const addToInvoice = async (req, res) => {
    const { owner, products, total } = req.body
    await InvoiceModel.create({ owner, products, total })
    res.json({ mesage: "Add to invoice successfully!" })
}

export const getInvoiceByUser = async (req, res) => {
    const { owner } = req.params
    const invoices = await InvoiceModel.find({ owner })
        .populate({
            path: 'products.productId',
            model: 'Product',
            select: 'name price'
        })
        .exec();

    const list = invoices.map((invoice) => {
        return {
            id: invoice._id,
            date: invoice.createdAt,
            products: invoice.products.map((product) => ({
                amount: product.amount,
                price: product.productId.price,
                name: product.productId.name
            })),
            total: invoice.total,
        };
    });
    
    res.json({ list })
}