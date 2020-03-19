//Imports
var models = require('../models');
var jwt = require('../util/jwt');
var asyncLib = require('async');

//Constantes



module.exports = {
    likePost : (req,res) => {
         //Get user header

        //On recupere de token sur l'entete
        var headerAuth = req.headers['authorization'];
        //On recupere l'ID de l'utilisateur en utilisant le token
        var userId = jwt.getUserId(headerAuth);

        //Param

        var messageId = parseInt(req.params.messageId);


        if(messageId === NaN || messageId <= 0){
            return res.status(404).json({'error' : 'Invalid parameters'});
        }

        asyncLib.waterfall([

            (done) => {
                var messageFound = models.Message.findOne({
                    where: {
                        id:messageId
                    }
                });

                if(messageFound === null){

                }else{
                    done(null,messageFound);
                }
            },
            (messageFound,done) => {
                if(messageFound){

                    const userFound = models.User.findOne({ where: { id: userId } });
                    if (userFound === null) {
                    console.log('Not found!');
                    } else {
                        done(null,messageFound,userFound);
                    }
                    
                    // models.User.findAll({
                    //     where: {
                    //         id:userId
                    //     }
                
                    // }).then((userFound) => {
            
                    //     done(null,messageFound,userFound);
            
                    // }).catch((err) => {
                    //     // return res.status(500).json({
                    //     //     'error': 'impossible de verifier cet utilisateur'
                    //     // });
                    //     console.log(err);
                    //     return res.status(500).json(userId);
                        
                    // });
                }else{
                    return res.status(404).json({'error' : 'post already liked'});
                }
            },
            (messageFound,userFound,done) => {
                if(userFound){

                    var isUserAlreadyliked = models.Likes.findOne({
                        where : {
                            messageId:messageId,
                            userId:userId
                        }
                    });

                    done(null,userFound,messageFound,isUserAlreadyliked);

                }else{
                    return res.status(404).json({'error' : 'User not exist'});
                }
            },
            (messageFound,userFound,isUserAlreadyliked,done) => {
                if(isUserAlreadyliked !== null){
                    models.Likes.create({
                        messageId:messageFound.id,
                        userId:userFound.id

                    }).
                    then( (alreadyLikedFound) => {
                        done(null,messageFound,userFound,alreadyLikedFound);
                    }).catch( (error) => {
                        console.log(error);
                        return res.status(500).json({'error' : 'Unable to set user reaction'});
                    })
                }else{
                    //console.log(isUserAlreadyliked);
                     return res.status(409).json({'error' : 'message already liked'});
                   
                }
            },
            (messageFound,userFound,done) => {
                messageFound.update({
                    likes : messageFound.likes + 1
                }).then( () => {
                    done(messageFound)
                }).catch( () => {
                    return res.status(500).json({'error' : 'Cannot update message like counter'});
                });
            }

        ], (messageFound) => {

            if(messageFound){
                return res.status(201).json(messageFound);
            }else{
                return res.status(500).json({'error' : 'Cannot update message'});
            }

        });
    },

    disLike : (req,res) => {
        asyncLib.waterfall([

            (done) => {
                models.Message.findOne({
                    where: {id:messageId}
                }).then( (messageFound) => {
                    done(null,messageFound);
                }).catch( () => {
                    return res.status(500).json({'error' : 'Unable to verify message'});
                });
            },
            (messageFound,done) => {
                if(messageFound){
                    models.User.findOne({
                        where : {id:userId}
                    }).then( (userFound) => {
                        done(null,messageFound,userFound);
                    }).catch( () => {
                        return res.status(500).json({'error' : 'Unable to verify user'});
                    });
                }else{
                    return res.status(404).json({'error' : 'post already liked'});
                }
            },
            (messageFound,userFound,done) => {
                if(userFound){

                    models.Likes.findOne({
                        where : {
                            messageId:messageId,
                            userId:userId
                        }
                    }).then( (isUserAlreadyliked) => {

                        done(null,userFound,messageFound,isUserAlreadyliked);

                    }).catch( () => {
                        return res.status(500).json({'error' : 'Unable to verify is user already liked'});
                    });

                }else{
                    return res.status(404).json({'error' : 'User not exist'});
                }
            },
            (messageFound,userFound,isUserAlreadyliked,done) => {
                if(isUserAlreadyliked){
                    isUserAlreadyliked.destro().
                    then( (alreadyLikedFound) => {
                        done(null,messageFound,userFound,isUserAlreadyliked);
                    }).catch( () => {
                        return res.status(500).json({'error' : 'Unable to set user reaction'});
                    })
                }else{
                    return res.status(409).json({'error' : 'message already liked'});
                }
            },
            (messageFound,userFound,done) => {
                messageFound.update({
                    likes : messageFound.likes - 1
                }).then( () => {
                    done(messageFound)
                }).catch( () => {
                    return res.status(500).json({'error' : 'Cannot update message like counter'});
                });
            }

        ], (messageFound) => {

            if(messageFound){
                return res.status(201).json(messageFound);
            }else{
                return res.status(500).json({'error' : 'Cannot update message'});
            }

        });
    }
}