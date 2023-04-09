const jwt = require('jsonwebtoken');
require('dotenv').config();

const authUserMiddleware = async (req, res, next) => {
    const userId = req.params.id;
    const token = req.headers.token?.split(' ')[1];
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
            if (err) {
                return res.status(401).json({ status: 'ERR', message: 'Xác thực người dùng thất bại'});
            }
            if (userId === user.userId || user.isAdmin) {
                next();
            } else {
                return res.status(401).json({ status: 'ERR', message: 'Xác thực người dùng thất bại'});
            }
        })
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error: ' + error.message});
    }
}

const authAdminMiddleware = async (req, res, next) => {

    const token = req.headers.token?.split(' ')[1];
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
            if (err) {
                return res.status(401).json({ status: 'ERR', message: 'Xác thực người dùng thất bại'});
            }
            if ( user.isAdmin ) {
                next();
            } else {
                return res.status(401).json({ status: 'ERR', message: 'Xác thực người dùng thất bại'});
            }
        })
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error: ' + error.message});
    }
}

module.exports = {
    authUserMiddleware,
    authAdminMiddleware
}