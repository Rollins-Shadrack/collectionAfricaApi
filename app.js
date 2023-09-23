const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const dotenv = require('dotenv')
const app = express()
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const {notFound, errorHandler}  = require('./middleware/errorMiddleware')

dotenv.config()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}))
app.use(morgan("common"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());
app.use(
    cors({
        origin: 'https://collectionafrica.netlify.app',
        methods: ['GET', 'POST'],
        credentials: true
    })
)
app.use('/uploads', express.static(__dirname+'/uploads'))


//Routes
app.use('/users', require('./routes/users'))
app.use('/admin', require('./routes/admin'))

//error handling middlewares
app.use(notFound)
app.use(errorHandler)
const server = require('http').createServer(app);

const PORT = process.env.PORT || 8000
mongoose.connect(process.env.MONGO_URL).then(async() =>{
    server.listen(PORT, () => console.log(`Server started at port ${PORT}`))
}).catch(err =>{
    console.log(`${err} did not connect`)
})
