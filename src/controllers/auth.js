import { log } from "console"
import AuthVerificationTokenModel from "../models/AuthVerificationTokenModel.js"
import UserModel from "../models/userModel.js"
import { sendErrorRes } from "../utils/sendErrorRes.js"
import crypto from 'crypto'
import mail from "../utils/mail.js"

const VERIFICATION_LINK = process.env.VERIFICATION_LINK
export const signUp = async (req, res) => {
    const { name, email, password } = req.body

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) return sendErrorRes(res, "Email is already exist!", 400)

    const user = await UserModel.create({ email, name, password })

    const token = crypto.randomBytes(36).toString('hex')
    await AuthVerificationTokenModel.create({ owner: user._id, token })

    const link = `${VERIFICATION_LINK}?id=${user._id}&token=${token}`;

    await mail.sendVerificationLink(user.email, link)

    res.json({ message: "Please check your inbox!" })
}


export const verifyEmail = async (req, res) => {
    const { id, token } = req.body

    const authToken = await AuthVerificationTokenModel.findOne({ owner: id })
    if (!authToken) return sendErrorRes(res, "Unauthorized request, invalid id!", 400)

    const isMatched = await authToken.compareToken(token)
    if (!isMatched) return sendErrorRes(res, "Invalid token!", 400)

    await AuthVerificationTokenModel.findByIdAndDelete(authToken._id)
    await UserModel.findByIdAndUpdate(id, { verified: true })

    res.json({ message: "Thank you for joining us, your email is verified!" })
}
