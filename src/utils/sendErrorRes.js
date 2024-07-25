export const sendErrorRes = (res, message, statusCode) => {
    return res.status(statusCode).json(message)
}