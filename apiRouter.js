//Imports
var express = require('express');
var userCtrl = require('./routes/userCtrl');
var messageCtrl = require('./routes/messageCtrl');


//Router

exports.router = (() => {
    var apiRouter = express.Router();
    apiRouter.route('/users/register/').post(userCtrl.register);
    apiRouter.route('/users/login/').post(userCtrl.login);
    apiRouter.route('/users/me/').get(userCtrl.getUserProfile);
    apiRouter.route('/users/me/').put(userCtrl.updateUser);
    apiRouter.route('/messages/').post(messageCtrl.createMessage);
    apiRouter.route('/messages/').get(messageCtrl.listMessages);
    return apiRouter;
})();