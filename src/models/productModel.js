const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    image: { type: String },
    countInStock: { type: Number },
    selled: { type: Number }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Product', ProductSchema);