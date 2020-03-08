require('dotenv').config();
var jwt = require('jsonwebtoken');

module.exports = {
    generateTokenforUser: (userdata)=>{
        return jwt.sign({
            'userId':userdata.id,
            'isadmin':userdata.isAdmin
        },
        process.env.API_JWT_USER_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRED_TIME,

        });
    }
}