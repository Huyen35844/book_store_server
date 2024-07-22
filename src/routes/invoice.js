import { Router } from "express";
import validate from "../middleware/validator.js";
import { InvoiceSchema } from "../utils/validationSchema.js";
import { isAuth } from "../middleware/auth.js";
import { addToInvoice, getInvoiceByUser } from "../controllers/invoice.js";

const invoiceRouter = Router()

invoiceRouter.post("/add", isAuth, validate(InvoiceSchema), addToInvoice)
invoiceRouter.get("/get-cart-by-user/:owner", isAuth, getInvoiceByUser)

export default invoiceRouter