const Models = require('../models');
const responseStatus = require('../helpers/responseStatus.js');
const validations = require('../helpers/validations.js');

const createContact = (request, response)=>{
	const { firstName, lastName, phone } = request.body;
	const userId = request.decoded.userId;

	// Add validations
	const errors = {
		messages: []
	}
	if(firstName == "" || lastName == "" || phone == ""){
		errors.messages.push("Provide All fields.");
	}
	if(!validations.validatePhone(phone)){
		errors.messages.push("Phone number provided is not valid.");
	}

  	if(errors.messages.length>0){
  		responseStatus.fieldMissing.reason.error = errors.messages;
		response.status(responseStatus.fieldMissing.code).json(responseStatus.fieldMissing.reason);
  	}else{

  		// Check if the user has already save the phone number.
  		Models.Contacts.findOne({
  			where: {
  				phone: phone,
  				createdBy: userId
  			}
  		}).then(function(contact){
  			if(contact){
  				// Contact with phone number already exists.
  				response.status(responseStatus.conflict.code).json(responseStatus.conflict.reason);
  			}else{
  				Models.Contacts.create({
					firstName: firstName,
					lastName: lastName,
					phone: phone,
					createdBy: userId,
				}).then(function(newContact) {
					responseStatus.success.reason.data = newContact;
			    	response.status(responseStatus.success.code).json(responseStatus.success.reason);
				}).catch(function(error){
					responseStatus.Parked.reason.error = error;
					response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
				});
  			}
  		}).catch(function(error){
			responseStatus.Parked.reason.error = error;
			response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
		});
  	}
}

const getAllContacts = (request, response)=>{
	const userId = request.decoded.userId;

	Models.Contacts.findAll({
		where:{
			createdBy: userId
		}
	}).then(function(rows) {
    	responseStatus.success.reason.data = rows;
    	response.status(responseStatus.success.code).json(responseStatus.success.reason);
  	}).catch(function(error){
		responseStatus.Parked.reason.error = error;
		response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
	});
}

const updateContact = (request, response)=>{

	const contactId = parseInt(request.params.contactId);
	const { firstName, lastName, phone } = request.body;


	// Add validations
	const errors = {
		messages: []
	}
	if(firstName == "" || lastName == "" || phone == ""){
		errors.messages.push("Provide All fields.");
	}
	if(!validations.validatePhone(phone)){
		errors.messages.push("Phone number provided is not valid.");
	}

  	if(errors.messages.length>0){
  		responseStatus.fieldMissing.reason.error = errors.messages;
		response.status(responseStatus.fieldMissing.code).json(responseStatus.fieldMissing.reason);
  	}else{
  		Models.Contacts.update({
			firstName: firstName,
			lastName: lastName,
			phone: phone
			}, {
			where: {
			    id: contactId
			}
		}).then(function(rowsUpdated) {
			if(rowsUpdated==0){
				response.status(responseStatus.noData.code).json(responseStatus.noData.reason);
			}
		    // Details Updated
	    	response.status(responseStatus.success.code).json({status: true, message: 'Contact Updated'});
		}).catch(function(error){
			responseStatus.Parked.reason.error = error;
			response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
		});
  	}
}

module.exports = {
	createContact: createContact,
	getAllContacts: getAllContacts,
	updateContact: updateContact
}