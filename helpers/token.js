const jwt = require('jsonwebtoken');
const responseStatus = require('./responseStatus.js');

const getToken = (payload)=>{
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: 60*60*24*10 // expires in 10 days
	});
	return token
}

const checkToken = (req, res, next)=>{
	// check header or url parameters or post parameters for token
  	var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
	// decode token
	if (token) {
		token = token.split(' ')[1]; // Bearer <token>
	    // verifies secret and checks exp
	    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
	    	if (err) {
	        	return res.status(responseStatus.authenticationFailure.code).json({ success: false, message: 'Failed to authenticate token.' });    
	        } else {
		        // if everything is good, save to request for use in other routes
		        req.decoded = decoded; 
		        next();
	      	}
	    });
	}
	else {
	    // if there is no token
	    // return an error
	    return res.status(responseStatus.authenticationFailure.code).json(responseStatus.authenticationFailure.reason);

	}
}

module.exports = {
	getToken: getToken,
	checkToken: checkToken
}