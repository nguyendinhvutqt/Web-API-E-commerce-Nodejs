const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { genneralAccessToken, genneralRefreshToken, refreshToken } = require('./jwt')
require('dotenv').config();

// Lấy danh sách người dùng
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        
        return res.status(200).json({ status: 'OK', data: users });
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error: ' + error.message});
    }
}

// Tạo tài khoản người dùng
const signUp = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
    
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ status: 'ERR', message: 'Thông tin không được để trống!'});
        }
        const regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        // Kiểm tra email
        const isEmail = regex.test(email);
        if (!isEmail) {
            return res.status(400).json({ status: 'ERR', message: 'Email không hợp lệ!'});
        }
    
        // Kiểm tra mật khẩu
        if ( password != confirmPassword ) {
            return res.status(400).json({ status: 'ERR', message: 'Hai mật khẩu không khớp!'});
        }
        
        // Mã hoá mật khẩu
        const hashPassword = bcrypt.hashSync(password, 10);

        const createUser = await User.create({
            username,
            email,
            password: hashPassword
        })
        return res.status(201).json({ status: 'OK', data: createUser});
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error: ' + error.message});
    }
}

// Đăng nhập người dùng
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'ERR', message: 'Thông tin không được để trống!'});
        }

        const checkUser = await User.findOne({email});
        if (checkUser && bcrypt.compareSync(password, checkUser.password)) {
            const data = {
                userId: checkUser._id,
                isAdmin: checkUser.isAdmin
            }

            // Tạo access token
            const access_token = await genneralAccessToken(data);

            // Tạo refresh token
            const refresh_token = await genneralRefreshToken(data);

            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                path: '/',
            })
            return res.status(201).json({ 
                ...checkUser,
                status: 'OK', 
                access_token, 
                access_token 
            });
        } else {
            return res.status(400).json({ status: 'ERR', message: 'Email hoặc mật khẩu không chính xác!'});
        }
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error: ' + error.message})
    }
}

// Lấy thông tin cá nhân
const profile = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ status: 'ERR', message: 'Id người dùng không hợp lệ!'});
        }
        const profile = await User.findOne({_id: userId});

        return res.status(200).json({ status: 'OK', data: profile });
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error: ' + error.message})
    }
}

// Cập nhật thông tin người dùng
const updateProfile = async (req, res) => { 
    try {
        const userId = req.params.id;
        const data = req.body;
        const updateProfile = await User.findByIdAndUpdate({_id: userId}, data, {new: true});

        return res.status(200).json({status: 'OK', data: updateProfile});
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error: ' + error.message})
    }
}

// Thay đổi mật khẩu
const changePassword = async (req, res) => {
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        
        if ( !oldPassword || !newPassword || !confirmNewPassword ) {
            return res.status(400).json({status: 'ERR', message: 'Thông tin không được để trống!'});
        }

        // kiểm tra 2 mật khẩu giống nhau
        if ( newPassword != confirmNewPassword ) {
            return res.status(400).json({status: 'ERR', message: 'Mật khẩu mới và nhập lại mật khẩu mới không khớp!'});
        }

        const user = await User.findOne({_id: userId});

        // kiểm tra mật khẩu cũ có khớp với db
        if (user && bcrypt.compareSync(oldPassword, user.password)) {

            // mã hoá mật khẩu
            const hashPassword = bcrypt.hashSync(newPassword, 10);

            const updatePassword = await User.findByIdAndUpdate({_id: userId}, { password: hashPassword}, {new: true});

            return res.status(200).json({status: 'OK', message: 'Thay đổi mật khẩu thành công!', data: updatePassword});
        } else {
            return res.status(400).json({status: 'ERR', message: 'Mật khẩu cũ không chính xác!'})
        }
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error: ' + error.message})
    }
}

// Xoá người dùng
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ status: 'ERR', message: 'Id người dùng không hợp lệ!'});
        }
        await User.findByIdAndDelete({_id: userId});
        return res.status(200).json({ status: 'OK', message: 'Xoá người dùng thành công!'});
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error: ' + error.message})
    }
}

const logout = (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Đăng xuất tài khoản thành công!'
        })
    } catch (error) {
        return res.status(500).json({
            status: 'ERR', message: 'Server error ' + error.message
        })
    }
}

const refreshTokenUser = async (req, res) => {
    try {
        let token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Không thấy token'
            })
        }
        const response = await refreshToken(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR', message: 'Server error ' + error.message
        })
    }
}

module.exports = {
    getUsers,
    signUp,
    signIn,
    profile,
    updateProfile,
    changePassword,
    deleteUser,
    logout,
    refreshTokenUser,

}