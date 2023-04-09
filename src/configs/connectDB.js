const mongoose = require('mongoose');

const connectDB = async (URL_DB) => {
    await mongoose.connect(URL_DB)
    .then(() => console.log('connect to DB successfully'))
    .catch((e) => console.log(e))
}

module.exports = connectDB