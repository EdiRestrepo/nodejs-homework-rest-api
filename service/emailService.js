const nodemailer = require("nodemailer");
require("dotenv").config();
const {EMAIL_SENDER,EMAIL_PASSWORD } = process.env;

const mailTransporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: EMAIL_SENDER,
        pass: EMAIL_PASSWORD,
    }
})


const emailService = {
    sendEmail(email, verificationToken){
        console.log("Sending email");
        mailTransporter.sendMail({
            from: EMAIL_SENDER,
            to: email,
            subject: "Authenticate your email",
            html:  `<a href='http://localhost:3000/api/users/verify/${verificationToken}'>Verification email</a>`
        }, (err, data)=>{
            if(err){
                console.log(err);
                console.log("An error occurred");
            }else{
                console.log("Email sent successfully")
            }
        })
    },
}

module.exports = emailService;