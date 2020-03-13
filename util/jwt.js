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
    },
    parseAuthorization : function(authorization){

        return (authorization != null) ? authorization.replace('Bearer ','') : null

    },
    getUserId: function(authorization){
        var userId = -1;

        var token = module.exports.parseAuthorization(authorization);

        if(token != null){
            try{
                let jwttoken = jwt.verify(token,process.env.API_JWT_USER_SECRET);

                if(jwttoken != null){
                    userId = jwttoken.userId;
                }
            }catch(error){

            }
        }

        return userId;
    }
}