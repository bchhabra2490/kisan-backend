const Models = require('../models');
const bcrypt = require('bcrypt');
const responseStatus = require('../helpers/responseStatus.js');
const getToken = require('../helpers/token.js').getToken;
const validations = require('../helpers/validations.js');

const createUser = (request, response)=>{
	const { name, email, username, password, phone } = request.body;
	
	// Add validations
	const errors = {
		messages: []
	}
	if(name == "" || email == "" || username == "" || password == "" || phone == ""){
		errors.messages.push("Provide All fields.");
	}
	if(password.length<6){
		errors.messages.push("Password too short.");
	}
	if(!validations.validatePhone(phone)){
		errors.messages.push("Phone number provided is not valid.");
	}
	if (!validations.validateEmail(email)) {
    	errors.messages.push("Email provided is not valid.");
  	}

  	if(errors.messages.length>0){
  		responseStatus.fieldMissing.reason.error = errors.messages;
		response.status(responseStatus.fieldMissing.code).json(responseStatus.fieldMissing.reason);
  	}else{
  		// Check if user with username exists
  		Models.Users.findOne({
  			where: { 
  				username : username
  			}
  		}).then(function(user){
  			if(user){
  				// User with username already exists.
  				response.status(responseStatus.conflict.code).json(responseStatus.conflict.reason);
  			}else{
  				bcrypt.hash(password, 10, function(err, hash) {
					if(err){
						//can't encrypt the password.
						response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
					}else{
						Models.Users.create({
							name: name,
							email: email,
			    			username: username,
			    			password: hash,
			    			phone: phone
						}).then(function(user) {
						    const payload = {
				       			userId: user.id
				       		};
				       		const token = getToken(payload);

					    	response.status(responseStatus.success.code).json({status: true, token: token, user: user});
						}).catch(function(error){
							responseStatus.Parked.reason.error = error;
							response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
						})
					}
			    });
  			}
  		}).catch(function(error){
			responseStatus.Parked.reason.error = error;
			response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
		})
  	}
}

const login = (request, response)=>{
	const { username, password } = request.body;


	// Add validations
	const errors = {
		messages: []
	}
	if(username == "" || password == ""){
		errors.messages.push("Provide All fields.");
	}

  	if(errors.messages.length>0){
  		responseStatus.fieldMissing.reason.error = errors.messages;
		response.status(responseStatus.fieldMissing.code).json(responseStatus.fieldMissing.reason);
  	}else{
  		Models.Users.findOne({
	    	where: {
	    		username: username
	  		}
		}).then(function(user) {
		    if(user){
		    	bcrypt.compare(password, user.password, function(err, res) {
			      if(res) {
			       // Passwords match
			       const payload = {
			       		userId: user.id
			       };
			       const token = getToken(payload);
			       response.status(responseStatus.success.code).json({status: true, token: token});
			      } else {
			      	// Passwords don't match
			      	responseStatus.authenticationFailure.reason.error = err;
			      	response.status(responseStatus.authenticationFailure.code).json(responseStatus.authenticationFailure.reason);
			      } 
		    	});
		    }else{
		    	response.status(responseStatus.noData.code).json(responseStatus.noData.reason);
		    }
		}).catch(function(error){
			responseStatus.Parked.reason.error = error;
			response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
		});
  	}
}

const updatePassword = (request, response)=>{
	const userId = request.decoded.userId;
	const {oldPassword, newPassword} = request.body;

	// Add validations
	const errors = {
		messages: []
	}
	if(oldPassword == ""){
		errors.messages.push("Provide All fields.");
	}
	if(newPassword.length<6){
		errors.messages.push("New Password too short.");
	}

  	if(errors.messages.length>0){
  		responseStatus.fieldMissing.reason.error = errors.messages;
		response.status(responseStatus.fieldMissing.code).json(responseStatus.fieldMissing.reason);
  	}else{
  		// Get the old password
		Models.Users.findOne({
	    	where: {
	    		id: userId
	  		}
		}).then(function(user) {
		    if(user){
		    	// Check if Passwords Match
		    	bcrypt.compare(oldPassword, user.password, function(err, res) {
			      if(res) {
			       // Passwords match. Save new password after hashing
			       bcrypt.hash(newPassword, 10, function(err, hash) {
						if(err){
							//can't encrypt the newPassword.
							response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
						}else{
							// Update the password
							Models.Users.update({
				    			password: hash,
								}, {
								where: {
								    id: userId
								}
							}).then(function() {
							    // Password Updated
						    	response.status(responseStatus.success.code).json(responseStatus.success.reason);
							}).catch(function(error){
								responseStatus.Parked.reason.error = error;
								response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
							});
						}
			    	});
			      } else {
			      	// Passwords don't match
			      	response.status(responseStatus.authenticationFailure.code).json(responseStatus.authenticationFailure.reason);
			      } 
		    	});
		    }else{
		    	response.status(responseStatus.noData.code).json(responseStatus.noData.reason);
		    }
		}).catch(function(error){
			responseStatus.Parked.reason.error = error;
			response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
		});
  	}
	
}

const updateUser = (request, response)=>{
	const userId = request.decoded.userId;
	const { name, phone } = request.body;

	// Adding Validations
	const errors = {
		messages: []
	}
	if(name == "" || phone == ""){
		errors.messages.push("Provide All fields.");
	}
	if(!validations.validatePhone(phone)){
		errors.messages.push("Phone number is not valid.");
	}

  	if(errors.messages.length>0){
  		responseStatus.fieldMissing.reason.error = errors.messages;
		response.status(responseStatus.fieldMissing.code).json(responseStatus.fieldMissing.reason);
  	}else{
  		Models.Users.update({
			name: name,
			phone: phone
			}, {
			where: {
			    id: userId
			}
		}).then(function() {
		    // Details Updated
	    	response.status(responseStatus.success.code).json({status: true, message: 'Details Updated'});
		}).catch(function(error){
			responseStatus.Parked.reason.error = error;
			response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
		});
  	}
	
}

const checkUsername = (request, response)=>{

	const username = request.params.username;

	Models.Users.findAll({
	    where:{
	    	username: username
	    }
	}).then(function(users) {
	    if(users.length>0){
	    	response.status(responseStatus.conflict.code).json(responseStatus.conflict.reason);
	    }else{
	    	response.status(responseStatus.success.code).json(responseStatus.success.reason);
	    }
	}).catch(function(error){
		responseStatus.Parked.reason.error = error;
		response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
	});
}

const getProfile = (request, response)=>{
	const userId = request.decoded.userId;

	Models.Users.findOne({
		where: {
			id: userId
		},
		attributes: ['name', 'email', 'phone', 'username']
	}).then(function(user){
		if(!user){
			response.status(responseStatus.noData.code).json(responseStatus.noData.reason);
		}else{
			responseStatus.success.reason.data = user;
			response.status(responseStatus.success.code).json(responseStatus.success.reason);
		}
	}).catch(function(error){
		responseStatus.Parked.reason.error = error;
		response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
	});
}

module.exports = {
	createUser: createUser,
	login: login,
	updatePassword: updatePassword,
	updateUser: updateUser,
	checkUsername: checkUsername,
	getProfile: getProfile
}