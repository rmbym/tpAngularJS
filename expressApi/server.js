const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongoDB = 'mongodb://yannick:mymdp@mongoDatabase/tpDatabase';

const port = 3000;
const app = express();


// useful functions
const utils = require('./utils');
// Mongodb connection
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 30000});
//mongoose.set('useCreateIndex', true);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connected");
});
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'/*http://localhost:4200*/);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    //res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    } else {
        return next();
    }
};

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes et methodes pour l'api
app.get('/', (req, res) => {
    res.send("Hello world");
});
app.post('/register', async (req, res, next) => {
    console.log('trying to create',req.body);
   await utils.createNewUser(req.body,res);
});

app.get('/list', async (req, res) => {
    console.log("received", req.body);
    await utils.getAllUsers(req,res).then(function() {console.log("ok");});
});

app.post('/missions', async (req, res) => {
    console.log("received", req.body);
    await utils.getMission(req.body.mail,res).then(function() {console.log("ok");});
});

app.post('/auth', async (req,res) => {
    await utils.authenticate(req.body,res);
});
app.post('/ops', async (req,res) => {
    await utils.getOps(req.body.name,res);
});
app.post('/createOps', async (req,res) => {
    await utils.createOperation(req.body,res);
});
app.post('/deleteOps', async (req,res) => {
    await utils.deleteOps(req.body,res);
});
app.post('/createMission', async (req,res) => {
    console.log(req.body);
    await utils.createMission(req.body,res);
});

app.listen(port, () => {
    console.log(` Express Api app listening at http://localhost:${port}`)
});