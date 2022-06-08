const JWT = require('jsonwebtoken')


// const encodedToken = (userID) => {
//     return JWT.sign({
//         iss: 'quyetsama',
//         sub: userID,
//         iat: new Date().getTime(),
//         exp: new Date().setDate(new Date().getDate() + 3)
//     }, process.env.JWT_SECRET)
// }

const encodedToken = (userID) => {
    return JWT.sign({
        sub: userID
    }, process.env.JWT_SECRET, { expiresIn: '3h' })
}

module.exports = {
    encodedToken
}