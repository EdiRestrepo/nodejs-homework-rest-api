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

const mailDetails = {
    from: EMAIL_SENDER,
    to: "edisonestival@gmail.com",
    subject: "TEST MAIL",
    html:  "<h1>EMAIL!!!!</h1>"
}

mailTransporter.sendMail(mailDetails, (err, data)=>{
    if(err){
        console.log(err);
        console.log("An error occurred");
    }else{
        console.log("Email sent successfully")
    }
})