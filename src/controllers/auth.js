import { log, profile } from "console"
import AuthVerificationTokenModel from "../models/AuthVerificationTokenModel.js"
import UserModel from "../models/UserModel.js"
import { sendErrorRes } from "../utils/sendErrorRes.js"
import crypto, { verify } from 'crypto'
import mail from "../utils/mail.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import PasswordResetTokenModel from "../models/PasswordResetTokenModel"
import cloudUploader from "../cloud/index.js"

const VERIFICATION_LINK = process.env.VERIFICATION_LINK
const JWT_SECRET = process.env.JWT_SECRET
const PASSWORD_RESET_LINK = process.env.PASSWORD_RESET_LINK

export const signUp = async (req, res) => {
    const { name, email, password } = req.body

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) return sendErrorRes(res, "Email is already exist!", 400)

    const user = await UserModel.create({ email, name, password })

    const token = crypto.randomBytes(36).toString('hex')
    await AuthVerificationTokenModel.create({ owner: user._id, token })

    const link = `${VERIFICATION_LINK}?id=${user._id}&token=${token}`;

    await mail.sendVerificationLink(user.email, link)

    res.json("Please check your inbox!")
}


export const verifyEmail = async (req, res) => {
    const { id, token } = req.body

    const authToken = await AuthVerificationTokenModel.findOne({ owner: id })
    if (!authToken) return sendErrorRes(res, "Unauthorized request, invalid id!", 400)

    const isMatched = await authToken.compareToken(token)
    if (!isMatched) return sendErrorRes(res, "Invalid token!", 400)

    await AuthVerificationTokenModel.findByIdAndDelete(authToken._id)
    await UserModel.findByIdAndUpdate(id, { verified: true })

    res.json("Thank you for joining us, your email is verified!")
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

export const grantTokens = async (req, res) => {
    const { refreshToken } = req.body
    console.log(refreshToken);
    if (!refreshToken) return sendErrorRes(res, "Unauthorized request!", 400)
    const payload = jwt.verify(refreshToken, JWT_SECRET)
    console.log('Decoded Payload:', payload);
    if (!payload.id) return sendErrorRes(res, "Unauthorized request!", 400)
    const userId = new mongoose.Types.ObjectId(payload.id)
    console.log(userId);
    const user = await UserModel.findOne({ _id: userId, tokens: refreshToken })
    if (!user) {
        //user is compromised, remove all the previous tokens
        await UserModel.findByIdAndUpdate(payload.id, { tokens: [] })
        return sendErrorRes(res, "Unauthorized request123!", 400)
    }

    const newRefreshToken = jwt.sign({ id: user._id }, JWT_SECRET)
    const newAccessToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15m" })

    const filteredTokens = user.tokens.filter((token) => token != refreshToken)
    user.tokens = filteredTokens
    user.tokens.push(newRefreshToken)
    await user.save()

    res.json({
        tokens: { refreshToken: newRefreshToken, accessToken: newAccessToken }
    })
}

export const signOut = async (req, res) => {
    const { refreshToken } = req.body

    const user = await UserModel.findOne({ _id: req.user.id, tokens: refreshToken })
    if (!user) return sendErrorRes(res, "Unauthorized request, user not found!", 400)

    const filteredTokens = user.tokens.filter((token) => token != refreshToken)
    user.tokens = filteredTokens
    await user.save()

    res.send()
}

export const generateForgetPasswordLink = async (req, res) => {
    const { email } = req.body

    const user = await UserModel.findOne({ email })
    if (!user) return sendErrorRes(res, "Unauthorized request, user not found!", 400)

    // Remove token in the case of sending the link earlier but user hasn't verify it yet and 
    // if we keep sending one more link, that user will have two veryfing link 
    // so make sure to remove the previous one before creating a new one
    await PasswordResetTokenModel.findOneAndDelete({ owner: user._id })

    const token = crypto.randomBytes(36).toString("hex")
    await PasswordResetTokenModel.create({ owner: user._id, token })

    const link = `${PASSWORD_RESET_LINK}?id=${user._id}&token=${token}`
    await mail.sendPasswordResetLink(user.email, link)

    res.json("Please check your inbox!")
}


export const grantValid = async (req, res) => {
    res.send({ valid: true })
}

export const updatePassword = async (req, res) => {
    const { id, password } = req.body

    const user = await UserModel.findById(id)
    if (!user) return sendErrorRes(res, "Unauthorized request!", 400)

    const isMatched = await user.comparePassword(password)
    if (isMatched) return sendErrorRes(res, "New password must be different!", 400)

    user.password = password
    await user.save()

    await PasswordResetTokenModel.findOneAndDelete({ owner: user._id })

    await mail.sendPasswordUpdateMessage(user.email)
    res.json("Password resets successfully")
}

export const updateProfile = async (req, res) => {
    const { name, phoneNumber, address } = req.body
    const { avatar } = req.files

    if (Array.isArray(avatar)) {
        return sendErrorRes(res, "Muliple files are not allowed!", 400)
    }
    if (!avatar.mimetype.startsWith("image")) {
        return sendErrorRes(res, "Invalid image file", 400)
    }
    const user = await UserModel.findById(req.user.id)
    if (!user) return sendErrorRes(res, "User not found!", 400)

    if (user.avatar.id) {
        //remove avatar file
        await cloudUploader.destroy(user.avatar.id)
    }

    //upload avatar file
    const { secure_url: url, public_id: id } = await cloudUploader.upload(
        avatar.filepath,
        {
            width: 300,
            height: 300,
            crop: "thumb",
            gravity: "face",
        }
    )

    await UserModel.findByIdAndUpdate(req.user.id, { name, phoneNumber, address, avatar: { url, id } })

    res.json({ profile: { ...req.user, name, phoneNumber, address, avatar: url } })
}

export const updateAvatar = async (req, res) => {
    const { avatar } = req.files
    if (Array.isArray(avatar)) {
        return sendErrorRes(res, "Muliple files are not allowed!", 400)
    }
    if (!avatar.mimetype.startsWith("image")) {
        return sendErrorRes(res, "Invalid image file", 400)
    }
    const user = await UserModel.findById(req.user.id)
    if (!user) return sendErrorRes(res, "User not found!", 400)

    if (user.avatar.id) {
        //remove avatar file
        await cloudUploader.destroy(user.avatar.id)
    }

    //upload avatar file
    const { secure_url: url, public_id: id } = await cloudUploader.upload(
        avatar.filepath,
        {
            width: 300,
            height: 300,
            crop: "thumb",
            gravity: "face",
        }
    )

    user.avatar = { url, id }
    await user.save()

    res.json({ profile: { ...req.user, avatar: user.avatar.url } })
}

export const generateVerificationLink = async (req, res) => {
    const { id } = req.user
    await AuthVerificationTokenModel.findOneAndDelete({ owner: id })
    const token = crypto.randomBytes(36).toString("hex")
    const link = `${VERIFICATION_LINK}?id=${id}&token=${token}`
    await AuthVerificationTokenModel.create({ owner: id, token })
    await mail.sendVerificationLink(req.user.email, link)
    res.json("Please check your inbox!")
}