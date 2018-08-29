var express = require('express'); 
var app = express();
var bodyParser = require('body-parser');
var config = require('./config');
var cors = require("cors");
var jwt = require('azure-ad-jwt');  // keys being downloaded every request TODO: cache the certificates!

// SERVER CONFIGURATION
app.use(cors({ origin: true }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || config.PORT;

var router = express.Router();
// all routes prefixed /api
app.use('/api', router);

// Verify Token
router.use(function (req, res, next) {
    var jwtToken = req.body.token || req.query.token || req.headers['access_token'];
    if(jwtToken){
        jwt.verify(jwtToken, null, function(err,result){
            if(result){
                req.auth = result;
                next();
            } else {
                console.log('Failed to authenticate token.');
                return res.status(401).send({ 
                    success: false, 
                    message: 'Failed to authenticate token.' 
                });    
            }
        });
    } else {
        console.log('No token was provided.');
        return res.status(403).send({ 
            success: false, 
            message: 'No token was provided.' 
        });
    }
});

// ROUTES FOR OUR API
// ============================================================================================

// test route (GET http://localhost:3001/api)
router.get('/test', function(req, res) {
    console.log("Test route");
    console.log(req.auth);
    res.send({ success: true, message: 'This is a test!' });   
});

// START
app.listen(port);
console.log("Server has started!");