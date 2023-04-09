const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// lấy danh sách tất cả đơn hàng theo id người dùng
const getOrderDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id người dùng khồn tồn tại!'
            })
        }
        const order = await Order.find({
            user: id
        }).sort({createdAt: -1, updatedAt: -1})
        if (order === null) {
            return res.status(400).json({ status: 'ERR', message: 'Đơn hàng không tồn tại' })
        }
        return res.status(200).json({ status: 'OK', data: order })
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error ' + error.message});
    }
}

// lấy đơn hàng theo id đơn hàng
const getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Id người dùng không tồn tại!'
            })
        }
        const order = await Order.findById({_id: orderId})
        if (order === null) {
            return res.status(400).json({ status: 'ERR', message: 'Đơn hàng không tồn tại' })
        }
        return res.status(200).json({ status: 'OK', data: order })
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error ' + error.message});
    }
}

// lấy tất cả đơn hàng
const getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find().sort({createdAt: -1, updatedAt: -1});
        return res.status(200).json({ status: 'OK', data: orders })
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error ' + error.message});
    }
}

// tạo đơn hàng
const createOrder = async (req, res) => {
    try {
        const { orderItems, paymentMethod, itemsPrice, totalPrice, fullName, address, phone, user, isPaid, paidAt } = req.body;
        if (!orderItems, !user, !paymentMethod, !itemsPrice, !totalPrice || !fullName || !address || !phone) {
            return res.status(400).json({ status: 'ERR', message: 'Thiếu thông tin order!'});
        }
        const promises = orderItems.map( async (order) => {
            const productData = await Product.findOneAndUpdate({
                    _id: order.product,
                    countInStock: {$gte: order.amount}
                },{
                    $inc: {
                        countInStock: - order.amount,
                        selled: + order.amount
                    }
                },{
                    new: true
                }
            )
            if (productData) {
                return {
                    status: 'OK',
                    message: 'SUCCESS'
                }
            } else {
                return{
                    status: 'OK',
                    message: 'ERR',
                    id: order.product
                }
            }
        })
        const results = await Promise.all(promises);
        const newData = results && results.filter((item) => item.id)
        if (newData.length) {
            const arrId = [];
            newData.forEach((item) => {
                arrId.push(item.id);
            })
            return res.status(400).json({ status: 'ERRR', message: `Sản phẩm với id: ${arrId.join(',')} không đủ hàng`});
        } else {
            const createOrder = await Order.create({
                orderItems,
                shipping: {
                    fullName,
                    address,
                    phone
                },
                paymentMethod,
                itemsPrice,
                totalPrice,
                user: user,
                isPaid, 
                paidAt
            })
            if (createOrder) {
                return res.status(201).json({ status: 'OK', message: 'Tạo đơn hàng thành công!', data: createOrder});
            }
        }
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error ' + error.message});
    }
}

// huỷ đơn hàng
const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const data = req.body;
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Khồn tồn tại đơn hàng!'
            })
        }
        let order = []
        const promises = data.map(async (order) => {
            const productData = await Product.findOneAndUpdate({
                _id: order.product,
                selled: {$gte: order.amount}
            },{
                $inc: {
                        countInStock: +order.amount,
                        selled: -order.amount
                    }
            }, {new: true });
            if (productData) {
                order = await Order.findByIdAndDelete(id)
                if (order === null) {
                    return res.status(400).json({status: 'ERR', message: 'Đơn hàng không tồn tại' });
                } else {
                    return res.status(200).json({status: 'OK', id: order.product})
                }
            }
        })
        const results = await Promise.all(promises);
        const newData = results && results[0].id;
        if(newData) {
            return res.status(400).json({status: 'ERR', message: `San pham voi id: ${newData} khong ton tai` });
        }
        return res.status(200).json({status: 'OK', data: order})
    } catch (error) {
        
    }
}

// duyệt đơn hàng
const deliveredOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(400).json({ status: 'ERR', message: 'Id hoá đơn không hợp lệ'}); 
        }
        const deliveredOrder = await Order.findByIdAndUpdate({_id: orderId}, {
            isDelivered: true,
            delivered_At: Date.now(),
        }, {new: true});
        return res.status(200).json({ status: 'OK', message: 'Giao hàng thành công!',  data: deliveredOrder}); 
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error ' + error.message});
    }
}

module.export = {
    getOrderDetailsUser,
    getOrderDetails,
    getAllOrder,
    createOrder,
    cancelOrder,
    deliveredOrder

}