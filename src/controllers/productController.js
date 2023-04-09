const Product = require('../models/productModel');


// lấy danh sách sản phẩm
const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 0, sort, filter } = req.query;
        const totalProduct = await Product.count();
        // sắp xếp sản phẩm 
        if (sort) {
            const objSort = {};
            objSort[sort[0]] = sort[1];
            console.log(objSort)
            const productsSort = await Product.find().populate('categoryId').limit(limit).skip(page * limit).sort(objSort);
            return res.status(200).json({ 
                status: 'OK', 
                total: totalProduct, 
                pageCurrent: Number(page) + 1, 
                totalPage: Math.ceil(totalProduct / limit), 
                data: productsSort
            });
        }
        // tìm kiếm sản phẩm
        if (filter) {
            const label = filter[0];
            const products = await Product.find({[label]: {'$regex': filter[1]}})
            const countProductsFilter = products.length;
            const productsFilter = await Product.find({[label]: {'$regex': filter[1]}}).populate('categoryId').limit(limit).skip(page * limit);
            return res.status(200).json({ 
                status: 'OK', 
                total: countProductsFilter, 
                pageCurrent: Number(page) + 1, 
                totalPage: Math.ceil(countProductsFilter / limit), 
                data: productsFilter
            });
        }
        const products = await Product.find().populate('categoryId').limit(limit).skip(page * limit);
        return res.status(200).json({ 
            status: 'OK', 
            total: totalProduct, 
            pageCurrent: Number(page) + 1, 
            totalPage: Math.ceil(totalProduct / limit), 
            data: products
        });
    } catch (error) {
        return res.status(500).json({status: 'ERR', message: 'Server error ' + error.message});
    }
}

// lấy một sản phẩm
const getProduct = async (req, res) => {
    const productId = req.params.id;
    if (!productId) {
        return res.status(400).json({status: 'Không tìm thấy Id sản phẩm!'});
    }
    try {
        const product = await Product.findOne({_id: productId});
        return res.status(200).json({ status: 'OK', data: product});
    } catch (error) {
        return res.status(500).json({status: 'ERR', message: 'Server error ' + error.message});
    }
}

// lấy sản phẩm theo danh mục
const getProductByCategory = async (req, res) => {
    console.log(req.params.id)
    const categoryId = req.params.id;
    if (!categoryId) {
        return res.status(400).json({status: 'Không tìm thấy Id danh mục!'});
    }
    try {
        const productsByCategory = await Product.find({categoryId}).populate('categoryId');
        return res.status(200).json({ status: 'OK', data: productsByCategory});
    } catch (error) {
        return res.status(500).json({status: 'ERR', message: 'Server error ' + error.message});
    }
}

// tạo sản phẩm
const createProduct = async (req, res) => {
    const { name, description, price, categoryId, image, countInStock } = req.body;
    if ( !name || !description || !price || !categoryId || !image || !countInStock ) {
        return res.status(400).json({ status: 'ERR', message: 'Thông tin không được để trống!'});
    }
    try {
        const checkNameExist = await Product.findOne({name});
        // kiểm tra tên tồn tại
        if (checkNameExist) {
            return res.status(400).json({status: 'ERR', message: 'Tên sản phẩm đã tồn tại!'});
        }
        // kiểm tra giá < 0
        if (price <= 0) {
            return res.status(400).json({status: 'ERR', message: 'Giá sản phẩm phải lớn hơn 0!'});
        }
        // kiểm tra số lượng < 0
        if (countInStock < 0) {
            return res.status(400).json({status: 'ERR', message: 'Số lượng sản phẩm phải lớn hơn hoặc bằng 0!'});
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            categoryId,
            image,
            countInStock
        })
        return res.status(201).json({ status: 'OK', message: 'Thêm sản phẩm thành công', data: newProduct});
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error: ' + error.message});
    }
}

// cập nhật sản phẩm
const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const data = req.body;
    if (!productId) {
        return res.status(400).json({status: 'Không tìm thấy Id sản phẩm!'});
    }
    try {
        const updateProduct = await Product.findByIdAndUpdate({_id: productId}, data, {new: true});
        return res.status(200).json({ status: 'OK', message: 'Cập nhật sản phẩm thành công!', data: updateProduct});
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error ' + error.message });
    }
}

// xoá sản phẩm
const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    if (!productId) {
        return res.status(400).json({status: 'Không tìm thấy Id sản phẩm!'});
    }
    try {
        await Product.findByIdAndRemove({_id: productId});
        return res.status(200).json({status: 'OK', message: 'Xoá sản phẩm thành công!'});
    } catch (error) {
        return res.status(500).json({status: 'ERR', message: 'Server error: ' + error.message});
    }
}

module.exports = {
    getProducts,
    getProduct,
    getProductByCategory,
    createProduct,
    updateProduct,
    deleteProduct
}