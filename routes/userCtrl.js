//Imports
var bcrypt = require('bcrypt');
var jwt = require('../util/jwt');
var models = require('../models');

var asyncLib = require('async');


//Constantes
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{8,}$/;
const {
    Op
} = require('sequelize');



//Routes

module.exports = {
    register: (req, res) => {
        //TODO: To implement

        // Get params
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var bio = req.body.bio;

        if (email == null || username == null || password == null || bio == null) {
            return res.status(200).json({
                'error': 'paramètres manquants'
            });
        }

        if (username.length >= 13 || username.length <= 4) {
            return res.status(200).json({
                'error': 'Le nom d\'utilisateur doit etre compris entre 5 et 12 caractères'
            });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(200).json({
                'error': 'L\'adresse e-mail est invalide'
            });
        }

        if (!PASSWORD_REGEX.test(password)) {
            return res.status(200).json({
                'error': 'Le mot de passe doit etre composer au moins 8 caracteres et un chiffre'
            });
        }

        asyncLib.waterfall(
            [
                function(done){
                    models.User.findOne({
                        where: {
                            [Op.or]: [{
                                email: {
                                    [Op.eq]: email
                                }
                            }, {
                                username: {
                                    [Op.eq]: username
                                }
                            }]
                        }
                    }).then((userFound) => {
            
                        done(null,userFound);
            
                    }).catch((err) => {
                        return res.status(500).json({
                            'error': 'impossible de verifier cet utilisateur'
                        });
                        
                    });
                }
                ,
                function(userFound,done){
                    if (!userFound) {

                        bcrypt.hash(password, 5, (err, bcryptedPassword) => {
                            done(null,userFound,bcryptedPassword);
                        });
        
                    } else {
                        return res.status(409).json({
                            'error': 'Cet utlisateur existe déjà !'
                        });
                    }
                },
                function(userFound,bcryptedPassword,done){
                    var newUser = models.User.create({
                        email: email,
                        username: username,
                        password: bcryptedPassword,
                        bio: bio,
                        isAdmin: 0

                    }).then((newUser) => {
                        done(newUser);
                    }).catch((err) => {
                        return res.status(500).json({
                            'error': 'Probleme d\'ajout de l\'utilisateur'
                        });
                        
                        
                    });
                }
            ]
            ,function(newUser){

                if(newUser){
                    return res.status(201).json({
                        'idUser': newUser.id
                    });
                }else{
                    return res.status(500).json({
                        'error': 'Probleme d\'ajout de l\'utilisateur'
                    });
                    
                }

            });

    },
    login: (req, res) => {
        //TODO: To implement

        var email = req.body.email;
        var password = req.body.password;

        if (email == null || password == null) {
            return res.status(200).json({
                'error': 'paramètres manquants'
            });
        }

        asyncLib.waterfall([
            (done) => {
                models.User.findOne({
                    where: {
                        email: email
                    }
                }).then((userFound) => {
                    done(null,userFound);
                }).catch((err) => {
                    return res.status(500).json({
                        'error': 'Impossible de verifier cet utilisateur'
                    });
                });
            },

            (userFound,done) => {
                if (userFound) {

                    bcrypt.compare(password, userFound.password, (errBcrypt, resBcrypt) => {
    
                        done(null,userFound,resBcrypt);
                    });
    
                } else {
                    return res.status(404).json({
                        'error': 'Cet utilisateur n\'existe pas dans la base de données'
                    });
                }
            }
            ,

            (userFound,resBcrypt,done) => {
                if (resBcrypt) {
                    done(userFound);
                } else {
                    return res.status(403).json({
                        'error': 'Le mot de passe est invalide'
                    });
                }
            }
        ],
            (userFound) => {
                if(userFound){

                    return res.status(200).json({
                        'isUser': userFound.id,
                        'token': jwt.generateTokenforUser(userFound)
                    });
                } else {
                    return res.status(403).json({
                        'error': 'Le mot de passe est invalide'
                    });
                }
            });


    },

    getUserProfile: function(req,res){
        let headerAuth = req.headers['authorization'];

        let userId = jwt.getUserId(headerAuth);

        if(userId<0){
            return res.status(400).json({'error':'wrong token'});
        }

        models.User.findOne({
            attributes:['id','email','username','bio'],
            where:{id:userId}
        }).then((user) => {
            if(user){
                return res.status(201).json(user);
            }else{
                return res.status(404).json({'error':'user not found'});
            }
        }).catch((error) => {
            return res.status(500).json({'error':'cannot fetch user'});
        });
    },
    updateUser: (req,res) => {
        let headerAuth = req.headers['authorization'];

        var userId = jwt.getUserId(headerAuth);

        var bio = req.body.bio;

        asyncLib.waterfall([

            (done) => {
                
                models.User.findOne({
                    attributes:['id','bio'],
                    where: {
                        id : userId
                    }
                }).then((userUpdate) => {
                    done(null,userUpdate);
                }).catch((error) => {
                    return res.status(404).json({'error':'User not found'});
                    
                });
            },

            (userUpdate,done) => {
                if(userUpdate){
                    userUpdate.update({
                        bio: (bio ? bio : userUpdate.bio)
                    }).then( (userUpdate) => {
                        done(userUpdate);
                    }).catch( (error) => {
                        res.status(500).json({'error':'cannot to update user'});
                    })
                }else{
                    res.status(404).json({'error' : 'user not found'});
                }
            }

        ], (userUpdate) => {
            if(userUpdate){
                res.status(201).json(userUpdate);
            }else{
                res.status(500).json({'error' : 'cannot update user'});
            }
        });

        
    }
}