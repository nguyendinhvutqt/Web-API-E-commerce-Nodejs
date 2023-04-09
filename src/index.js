const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors')

require('dotenv').config();
const connectDB = require('./configs/connectDB');
const routes = require('./routes/index')

const PORT = process.env.PORT || 3005;

app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(bodyParser.json())
app.use(cookieParser())


routes(app);

connectDB(process.env.CONNECTION_STRING);
app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
})