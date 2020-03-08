//Imports
var bcrypt = require('bcrypt');
var jwt = require('../util/jwt');
var models = require('../models');

//Routes

module.exports = {
    register : (req,res)=>{
        //TODO: To implement

        // Get params
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var bio = req.body.bio;

        if(email == null || username == null || password == null || bio ==null){
            return res.status(200).json({'error':'paramètres manquants'});
        }

        models.User.findOne({
            attributes:['email'],
            where:{email:email}
        }).then((userFound)=>{

            if(!userFound){

                bcrypt.hash(password,5,(err,bcryptedPassword)=>{
                    var newUser = models.User.create({
                        email:email,
                        username:username,
                        password:bcryptedPassword,
                        bio:bio,
                        isAdmin:0

                    }).then((newUser)=>{
                        return res.status(201).json({'idUser':newUser.id});
                    }).catch((err)=>{
                        return res.status(500).json({'error':'Probleme d\'ajout de l\'utilisateur'});
                    });
                });

            }else{
                return res.status(409).json({'error':'Cet utlisateur existe déjà !'});
            }

        }).catch((err)=>{
            return res.status(500).json({'error':'impossible de verifier cet utilisateur'});
        });

    },
    login : (req,res) => {
        //TODO: To implement

        var email = req.body.email;
        var password = req.body.password;

        if(email == null || password == null){
            return res.status(200).json({'error':'paramètres manquants'});
        }


        models.User.findOne({
            where:{email:email}
        }).then((userFound)=>{

            if(userFound){

                bcrypt.compare(password,userFound.password,(errBcrypt,resBcrypt)=>{

                    if(resBcrypt){
                        return res.status(200).json({
                            'isUser':userFound.id,
                            'token':jwt.generateTokenforUser(userFound)
                        });
                    }else{
                        return res.status(403).json({'error':'Le mot de passe est invalide'});
                    }
                });

            }else{
                return res.status(404).json({'error':'Cet utilisateur n\'existe pas dans la base de données'});
            }

        }).catch((err)=>{
            return res.status(500).json({'error':'Impossible de verifier cet utilisateur'});
        });
    }
}