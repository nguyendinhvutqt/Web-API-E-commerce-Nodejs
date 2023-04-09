const userRouter = require('./userRouter')
const productRouter = require('./productRouter')
const categoryRouter = require('./categoryRouter')

const routes = (app) => {
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/product', productRouter);
    app.use('/api/v1/category', categoryRouter);
    app.use('/api/v1/order', categoryRouter);
}

module.exports = routes