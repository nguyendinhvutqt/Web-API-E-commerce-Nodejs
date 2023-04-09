const jwt = require('jsonwebtoken');
require('dotenv').config();

const genneralAccessToken  = async (payload) => {
    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '1h'});
    return access_token;
}

const genneralRefreshToken  = async (payload) => {
    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365h'});
    return refresh_token;
}

const refreshToken = (token) => {
    jwt.verify(token, process.env.REFRESH_TOKEN, async function (err, user) {
        if (err) {
            return res.status(401).json('Chưa xác thực người dùng!')
        }
        const access_token = await genneralAccessToken({
            id: user.id,
            isAdmin: user.isAdmin
        })
        return res.status(200).json({ status: 'OK', access_token})
    })
}

module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshToken
}

