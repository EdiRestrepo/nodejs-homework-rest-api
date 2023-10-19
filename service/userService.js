const User = require("./schemas/users");

const getUserByEmail = async (email) =>{
    return User.findOne({email});
}

const getUserByVerificationToken = async (token) =>{
    return User.findOne({verificationToken: token})
}

module.exports = {
    getUserByEmail,
    getUserByVerificationToken
}