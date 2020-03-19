//Imports
var bcrypt = require('bcrypt');
var jwt = require('../util/jwt');
var models = require('../models');
var asyncLib = require('async');

//Constantes



//Routes
module.exports = {
    createMessage : (req,res) => {
        //Get user header

        //On recupere de token sur l'entete
        var headerAuth = req.headers['authorization'];
        //On recupere l'ID de l'utilisateur en utilisant le token
        var userId = jwt.getUserId(headerAuth);

        //Params 
        var title = req.body.title;
        var content = req.body.content;

        //Validations

        if(title === null || content === null){
            return res.body(400).json({'error' : 'missing parameters'});
        }

        if(title.length <= 2 || content <= 4){
            return res.body(400).json({'error' : 'invalide parameters'});
        }

        //Enregistrement du message

        //Un waterfall
        /*Exécute un tableau de fonctions en série, chacune transmettant ses résultats à la suivante dans le tableau. 
        Cependant, si l'une des fonctions transmet une erreur au rappel, la fonction suivante n'est pas exécutée et 
        le rappel principal est immédiatement appelé avec l'erreur.*/
        asyncLib.waterfall([

            //On recupere d'abors l'utilisateur
            (done) => {
                models.User.findOne({
                    where:{id:userId}
                }).then( (user) => {
                    //Si l'utilisateur est trouvé, on récupere l'utilisateur et on continue sur la fonction suivante
                    done(null,user);
                }).catch( (error) => {
                    return res.status(200).json({'error' : 'User not found'});
                })
            },
            (user,done) => {
            //Si l'utilisateur existe
             if(user){
                 //On crée le message
                models.Message.create(
                    {
                        title:title,
                        content:content,
                        likes:0,
                        UserId:user.id
                    }
                ).then( (newMessage) => {
                    //Si le message à été crée, on recupere le nouveau message
                   done(newMessage);
                });
             }else{
                 return res.status(404).json({'error' : 'user not found'});
             }
            }

        ], //Si tout les fonctions sur le tableau se sont bien exécutée, on passe sur cette fonction
        (newMessage) => {
            //Si le nouveau message à été crée
            if(newMessage){
                //On renvoie le nouveau message en json
                return res.status(201).json(newMessage);
            }else{
                //Sinon on envoie un message
                return res.status(500).json({'error' : 'Connot post message'});
            }
        });
    },
    listMessages : (req,res) => {

        //Les attributs a afficher
        let fields = req.query.fields;

        //Le nombre d'elements a afficher
        let limit = parseInt(req.query.limit);

        let offset = parseInt(req.query.offset);

        //Ordonner les elements
        let order = req.query.order;

        models.Message.findAll({
            order : [(order != null) ? order.split(':') : ['title','ASC']],
            attributes : (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit : (!isNaN(limit)) ? limit : null,
            offset : (!isNaN(offset)) ? offset : null,
            //Inclure l'utilisateur par la relation
            include : [{
                model : models.User,
                //Les attributs a afficher sur l'utilisateur
                attributes : ['username']
            }]

        }).then( (messagesList) => {

            //Si la requete a renvoyer des messages
            if(messagesList){
                //On envoie les messages en json
                return res.status(201).json(messagesList);
            }else{
                //Si non on envoie un message pour dire que aucun message n'est trouvé
                res.status(404).json({'error' : 'No messages found'});
            }
            //En cas d'erreur
        }).catch( (error) => {

            //On affiche l'erreur sur console
            console.log(error);
            //On renvoie un message
            res.status(500).json({'error' : 'Invalid fields'})

        });
    }
}