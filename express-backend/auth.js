var jwt = require('azure-ad-jwt');  // keys being downloaded every request TODO: cache the certificates!

module.exports = {
    isAuthenticated: function (req, res, next) {
        var jwtToken = req.body.token || req.query.token || req.headers['access_token'];
        if(jwtToken){
            jwt.verify(jwtToken, null, function(err,result){
                if(result){
                    req.auth = result;
                    next();
                } else {
                    return res.status(401).send({ 
                        success: false, 
                        message: 'Failed to authenticate token.' 
                    });    
                }
            });
        } else {
            return res.status(403).send({ 
                success: false, 
                message: 'No token was provided.' 
            });
        }
    }
}