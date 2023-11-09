const dotenv = require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./router/router')
const sequelize = require('./utils/database')
const fs = require('fs')
const path = require('path')
const helmet = require('helmet')

const morgan = require('morgan')
const { config } = require('dotenv')
config({ path: './.env' })


const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
)

const corsOptions = {
    origin: 'https://start-expense-tracker.onrender.com', // Replace with the domain you want to allow
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Enable cookies and authentication headers
}
const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(helmet())
app.use(morgan('combined', { stream: accessLogStream }))
app.use(router)


app.use(express.static(path.join(__dirname, './client/build')))

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'))
})

sequelize.sync().then(res => {
    app.listen(process.env.PORT, () => {
        console.log('server started...')
    })

}).catch(err => console.log(err))
