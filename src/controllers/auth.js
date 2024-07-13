import { log } from "console"
import AuthVerificationTokenModel from "../models/AuthVerificationTokenModel.js"
import UserModel from "../models/userModel.js"
import { sendErrorRes } from "../utils/sendErrorRes.js"
import crypto from 'crypto'
import mail from "../utils/mail.js"

const VERIFICATION_LINK = process.env.VERIFICATION_LINK
console.log(VERIFICATION_LINK);
export const signUp = async (req, res) => {
    const { name, email, password } = req.body

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) return sendErrorRes(res, "Email is already exist!", 400)

    const user = await UserModel.create({ email, name, password })

    const token = crypto.randomBytes(36).toString('hex')
    await AuthVerificationTokenModel.create({ owner: user._id, token })

    const link = `${VERIFICATION_LINK}?id=${user._id}&token=${token}`;
    console.log(link);

    await mail.sendVerificationLink(user.email, link)

    res.json({ message: "Please check your inbox!" })
}