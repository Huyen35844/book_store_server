import { log } from "console"
import AuthVerificationTokenModel from "../models/AuthVerificationTokenModel.js"
import UserModel from "../models/userModel.js"
import { sendErrorRes } from "../utils/sendErrorRes.js"
import crypto, { verify } from 'crypto'
import mail from "../utils/mail.js"
import jwt from "jsonwebtoken"

const VERIFICATION_LINK = process.env.VERIFICATION_LINK
const JWT_SECRET = process.env.JWT_SECRET

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

export const signIn = async (req, res) => {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })
    if (!user) return sendErrorRes(res, "Email/Password is mismatch!User not found!", 400)

    const isMatched = await user.comparePassword(password)
    if (!isMatched) return sendErrorRes(res, "Email/Password is mismatch!", 400)

    const payload = { id: user._id }
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" })
    const refreshToken = jwt.sign(payload, JWT_SECRET)

    if (!user.tokens) user.tokens = [refreshToken]
    else user.tokens.push(refreshToken)

    await user.save()

    res.json({
        profile: {
            id: user._id,
            email: user.email,
            name: user.name,
            verified: user.verified,
            avatar: user.avatar?.url
        },
        tokens: {
            refresh: refreshToken,
            access: accessToken
        }
    })
}


export const getProfile = async (req, res) => {
    res.json({ ...req.user })
}
