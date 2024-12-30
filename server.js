
const dotenv = require('dotenv')
const path = require('path')
const connectDb = require('./database')

const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const cors =require('cors')

app.use(express.json())
app.use(cookieParser())

const auth = require('./router');

app.use('/api/v1/',auth)

dotenv.config({path:path.join(__dirname,'config.env')}) 
connectDb()
app.use(cors({
    origin:'http://localhost:3000',
    methods:['POST','GET','PUT','DELET']
}));


app.listen(process.env.PORT,()=>{
    console.log(`port listen in :${process.env.PORT}`)
})