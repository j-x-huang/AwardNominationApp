var express = require('express'); 
var app = express();
var bodyParser = require('body-parser');
var config = require('./config');
var auth = require('./auth');
var cors = require("cors");
var firebase = require('firebase');
require('firebase/database');

// DATABASE
firebase.initializeApp(config.firebaseConfig); 

// SERVER CONFIGURATION
app.use(cors({ origin: true }))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || config.PORT;

var router = express.Router();
// all routes prefixed /api
app.use('/api', router);

// Verify Token every request
router.use(auth.isAuthenticated);

// ROUTES FOR OUR API
// ============================================================================================

// test route (GET http://localhost:3001/api)
router.get('/test', function(req, res) {
    console.log("Test route");
    console.log(req.auth);
    res.send({ success: true, message: 'This is a test!' });   
});

router.get('/nominations', function(req, res) {
    const defaultDatabase = firebase.database();
    const nomRef = defaultDatabase.ref("nominations/");
    nomRef.once('value').then(function(snapshot) {
        if (snapshot != null) {
            // console.log(snapshot.toJSON());
            res.status(200).send(snapshot.toJSON());
        } else {
            res.status(401).send({ success: false, message: "failed to retrieve nominations" });
        }
    });
});

// START
app.listen(port);
console.log("Server has started!");