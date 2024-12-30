const SendEmail = require('./email')
const User = require('./userModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')



// registerApi = http://localhost:6500/api/v1/register/
exports.userRegister=async (req,res,next) => {
    const { name,email,password}=req.body
    const user = await User.create({
        name,
        email,
        password
    })

    const token = user.getJwtToken();

    const options={
        expires: new Date(Date.now()+process.env.COOKIE_EXPIRES_TIMES*24*60*60*100),
        httpOnly:true,
    }

    res.status(200)
    .cookie('token',token,options)
    .json({
        success:true,
        user,
        token
    })
}


// loginApi = http://localhost:6500/api/v1/login/
exports.userLogin=async (req,res,next) => {
    const {email,password} = req.body

    if(!email || !password){
       return res.status(400).json({
            success:false,
            message:'user invalid'
        })
    }

    const user = await User.findOne({email}).select('+password')
   
    if(!user){
       return res.status(400).json({
            success:false,
            message:'user invalid'
        })
    }

    if(!await bcrypt.compare(password,user.password)){
        res.status(400).json({
            success:false,
            message:'user invalid'
        })
    }

    const token = user.getJwtToken()

    res.status(201).json({
        success:true,
        user,
        token
    })
}

/*exports.forgotPassword = async (req,res,next) => {
   const user = await User.findOne({email:req.body.email})

   if(!user){
      res.status(401).json({
        success:false,
        message:'user not found'
      })
   }

   const resetToken = user.getResetToken();
   user.save({validateBeforeSave:false})

   const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

   const message = `Your Password reset url is as follows \n\n ${resetUrl} \n\n 
   if you have not requested  this email, then ignore it.`

   try{
      
    SendEmail({
        email: user.email,
        subject:"password Recovery",
        message
    })

    res.status(200).json({
        success:true,
        message:`Email sent to ${user.email}`
    })

   }catch(err){
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({validateBeforeSave:false});
    return 
   }
}*/


//forgotPasswordApi = http://localhost:6500/api/v1/forgots/
exports.forgot =async(req,res,next)=>{
    const {email}=req.body

    if(!email){
        return res.status(400).json({
            success:false,
            message:"pls provide email"
        })
    }

    const user = await User.findOne({email})

    if(!user){
        return res.status(400).json({
            success:false,
            message:"user not found"
        })
    }
    const token = user.getJwtToken();
    user.save({validateBeforeSave:false});

    const transporter = nodemailer.createTransport({
        service:"gmail",
        secure:true,
        auth:{
            user:process.env.MY_GMAIL,
            pass:process.env.MY_PASSWORD,
        },
    });
    
    const receiver ={
        from:  `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`, 
        to:email,
        subject:"Password reset Request",
        text:`Click the URL: http://localhost:3000/reset/${token}`,

    }
    await transporter.sendMail(receiver)
    res.status(201).json({
        success:true,
        message:`mail send ${user.email}`
    })
}



exports.resetPassword=async (req,res,next) => {
    
    const{token} = req.params;
    const{password} = req.body;

    if(!password){
        res.status(400).json({
            success:false,
            message:"pls provide password"
        })
    }

    const decode = jwt.verify(token,process.env.JWT_SECRET)

    const user = await User.findOne({_id:decode.id})
    
    const salt = await bcrypt.genSalt()
    const newHashPassword = await bcrypt.hash(password,salt)
    await User.findOneAndUpdate(
    {_id:decode.id},
    {password:newHashPassword}
    )

    res.status(200).json({
        success:true,
        message:"reset successfully"
    })

    
}