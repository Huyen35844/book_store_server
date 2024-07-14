import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS
    }
})

const sendVerificationLink = async (email, link) => {
    transporter.sendMail({
        from: process.env.MAIL_AUTH_USER,
        to: email,
        subject: "Verify your email from Book Store",
        html: `<h1>Please click on <a href="${link}"> this link </a> to verify your account!</h1>`
    })
}

const sendPasswordResetLink = async (email, link) => {
    transporter.sendMail({
        from: process.env.MAIL_AUTH_USER,
        to: email,
        subject: "Reset your password from Book Store",
        html: `<h1>Please click on <a href="${link}"> this link </a> to reset your password!</h1>`
    })
}
const mail = {
    sendVerificationLink,
    sendPasswordResetLink
}

export default mail;

