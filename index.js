const express = require('express')
const ejs = require('ejs')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const app = express()

//Routes
const indexRoute = require('./routes/index.route')
const brandRoute = require('./routes/brand.route')
const phoneRoute = require('./routes/phone.route')

//Middlewares
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(methodOverride('_method'))

const mongoURI = require('./config/keys').mongoURI

//Connect to DB
mongoose.connect(mongoURI, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//Route Middleware
app.use('/', indexRoute)
app.use('/brands', brandRoute)
app.use('/phones', phoneRoute)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})