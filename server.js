
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

app.use(cors());

app.listen(process.env.PORT, async () => {
    try {
      await connectDb;
      console.log(
        `Server listening to the port: ${process.env.PORT} in ${process.env.NODE_ENV}`
      );
    } catch (err) {
      console.log(err);
    }
  });
  