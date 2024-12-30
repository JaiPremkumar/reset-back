const jwt = require('jsonwebtoken')
const User = require('./userModel')

exports.authentic=async (req,res,next) => {
    const {token} = req.cookies

    if(!token){
        return res.status(400).json({
            success:false,
            message:'register first'
        })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.user =await User.findById(decode.id)
    next()
}