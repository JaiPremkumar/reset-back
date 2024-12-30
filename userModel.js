const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,'enter valid email']
    },
    password:{
       type:String,
       required:true,
       maxLength:[6,'must be 6 char'],
       select:false
    },
    resetPasswordToken:String,
    resetPasswordTokenExpire:Date,
})

userSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        next()
        
    }
    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.getJwtToken =  function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}

userSchema.methods.isvalidate=async function (enterpassword) {
   return await bcrypt.compare(enterpassword,this.password)
}

userSchema.methods.getResetToken = function () {
    const token = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

    return token
}

let Schema = mongoose.model('user',userSchema)

module.exports = Schema;