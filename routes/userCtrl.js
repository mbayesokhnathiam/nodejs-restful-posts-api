//Imports
var bcrypt = require('bcrypt');
var jwt = require('../util/jwt');
var models = require('../models');


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

            if (!userFound) {

                bcrypt.hash(password, 5, (err, bcryptedPassword) => {
                    var newUser = models.User.create({
                        email: email,
                        username: username,
                        password: bcryptedPassword,
                        bio: bio,
                        isAdmin: 0

                    }).then((newUser) => {
                        return res.status(201).json({
                            'idUser': newUser.id
                        });
                    }).catch((err) => {
                        return res.status(500).json({
                            'error': 'Probleme d\'ajout de l\'utilisateur'
                        });
                    });
                });

            } else {
                return res.status(409).json({
                    'error': 'Cet utlisateur existe déjà !'
                });
            }

        }).catch((err) => {
            return res.status(500).json({
                'error': 'impossible de verifier cet utilisateur'
            });
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


        models.User.findOne({
            where: {
                email: email
            }
        }).then((userFound) => {

            if (userFound) {

                bcrypt.compare(password, userFound.password, (errBcrypt, resBcrypt) => {

                    if (resBcrypt) {
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

            } else {
                return res.status(404).json({
                    'error': 'Cet utilisateur n\'existe pas dans la base de données'
                });
            }

        }).catch((err) => {
            return res.status(500).json({
                'error': 'Impossible de verifier cet utilisateur'
            });
        });
    }
}