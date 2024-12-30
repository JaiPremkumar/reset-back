const nodemailer = require('nodemailer')

const SendEmail = async options => {
    const transport={
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASS
        }
    };

    const transporter = nodemailer.createTransport(transport)

    const message ={
        from:  `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to:options.email,
        subject:options.subject,
        text:options.message

    }
        /*const message ={
            from:  `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
            to:options.email,
            subject:"Password reset Request",
            text:`click on thi link generate your new password ${process.env.CLINET_URL}/rest-password ${token}`,
    
        }*/

    await transporter.sendMail(message)
}

module.exports = SendEmail