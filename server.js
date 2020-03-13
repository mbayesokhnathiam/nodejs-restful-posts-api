//Import
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;

//Variable d'environnement
const port = process.env.PORT;
const env = process.env.NODE_ENV;
const baseURL = process.env.BASE_URL;

//Instanciate server
var server = express();

//Body Parser configuration

server.use(bodyParser.urlencoded({extended:true}));// Forcer le parse dans des objets inclus dans d'autre
server.use(bodyParser.json());//Preciser que nous voulons parser du Json

//Configure Route
server.get('/',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.status(200).send('<h1>RestFul API</h1>');
});

server.use(baseURL,apiRouter);
//Launch server
server.listen(port,() => {
    console.log(`Le server a demarrer sur le port ${port}`);
});