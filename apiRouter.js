//Imports
var express = require('express');
var userCtrl = require('./routes/userCtrl');


//Router

exports.router = (()=>{
    var apiRouter = express.Router();
    apiRouter.route('/users/register/').post(userCtrl.register);
    apiRouter.route('/users/login/').post(userCtrl.login);

    return apiRouter;
})();