const Category = require('../models/categoryModel');

// lấy danh sách danh mục sản phẩm
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 'desc'});

        if (categories == null) {
            return res.status(400).json({ status: 'ERR', message: 'Danh mục trống!'});
        } else {
            return res.status(200).json({ status: 'OK', data: categories});
        }
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error ' + error.message});
    }
}

// Tạo danh mục sản phẩm
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ status: 'ERR', message: 'Thông tin không được để trống!'});
        }
        const newCategory = await Category.create({name});
        if (newCategory) {
            return res.status(201).json({ status: 'OK', message: 'Thêm danh mục thành công!', data: newCategory});
        } else {
            return res.status(400).json({ status: 'ERR', message: 'Thêm danh mục thất bại!'});
        }
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error ' + error.message});
    }
}

// cập nhật danh mục sản phẩm
const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const data = req.body;
        if (!categoryId) {
            return res.status(400).json({ status: 'ERR', message: 'Không tìm thấy Id danh mục!'});
        }
        const update = await Category.findByIdAndUpdate({_id: categoryId}, data, { new: true });
        if (update) {
            return res.status(201).json({ status: 'OK', message: 'Cập nhật danh mục thành công!', data: update});
        } else {
            return res.status(400).json({ status: 'ERR', message: 'Cập nhật danh mục thất bại!'});
        }
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error ' + error.message});
    }
}

// Xoá danh mục sản phẩm
const deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
    if (!categoryId) {
        return res.status(400).json({ status: 'ERR', message: 'Không tìm thấy Id danh mục!'});
    }
    try {
        const deleteCategory = await Category.findOneAndDelete({_id: categoryId});
        if (deleteCategory) {
            return res.status(201).json({ status: 'OK', message: 'Xoá danh mục thành công!'});
        } else {
            return res.status(400).json({ status: 'ERR', message: 'Xoá danh mục thất bại!'});
        }
    } catch (error) {
        return res.status(500).json({ status: 'ERR', message: 'Server error ' + error.message});
    }
}


module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
}