//Imports
var express = require('express');
var userCtrl = require('./routes/userCtrl');
var messageCtrl = require('./routes/messageCtrl');
var likeCtrl = require('./routes/likeCtrl');


//Router

exports.router = (() => {

    //Get router express object
    var apiRouter = express.Router();

    //User
    apiRouter.route('/users/register/').post(userCtrl.register);
    apiRouter.route('/users/login/').post(userCtrl.login);
    apiRouter.route('/users/me/').get(userCtrl.getUserProfile);
    apiRouter.route('/users/me/').put(userCtrl.updateUser);

    //Message Post
    apiRouter.route('/messages/').post(messageCtrl.createMessage);
    apiRouter.route('/messages/').get(messageCtrl.listMessages);

    //Likes
    apiRouter.route('/message/:messageId/vote/like').post(likeCtrl.likePost);
    apiRouter.route('/message/:messageId/vote/dislike').post(likeCtrl.disLike);
    return apiRouter;
})();