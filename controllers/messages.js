const Models = require('../models');
const responseStatus = require('../helpers/responseStatus.js');
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const MSG91_API_KEY = process.env.MSG91_API_KEY;
var msg91 = require("msg91")(MSG91_API_KEY, "BHARAT", "4" );

// Get All messages of a user
const getAllMessages = (request, response)=>{
	const userId = request.decoded.userId;

	Models.Messages.findAll({
		where:{
			sendFrom: userId
		},
		order:[['createdAt', 'DESC']],
		include: [{
			model: Models.Users,
			attributes: ['name']
		},{
			model: Models.Contacts,
			attributes: ['firstName', 'lastName', 'phone']
		}]
	}).then(function(rows) {
    	responseStatus.success.reason.data = rows;
    	response.status(responseStatus.success.code).json(responseStatus.success.reason);
  	}).catch(function(error){
		responseStatus.Parked.reason.error = error;
		response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
	});
}

// Get Messages by contactId
const getMessagesById = (request, response)=>{
	const userId = request.decoded.userId;
	const contactId = parseInt(request.params.contactId);

	Models.Messages.findAll({
		where:{
			sendFrom: userId
		},
		order:[['createdAt', 'DESC']],
		include: [{
			model: Models.Users,
			attributes: ['name']
		},{
			model: Models.Contacts,
			attributes: ['firstName', 'lastName', 'phone'],
			where: { id: contactId}
		}]
	}).then(function(rows) {
    	responseStatus.success.reason.data = rows;
    	response.status(responseStatus.success.code).json(responseStatus.success.reason);
  	}).catch(function(error){
		responseStatus.Parked.reason.error = error;
		response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
	});
}

const sendMessage = (request, response)=>{
	const { message, contactId } = request.body;
	const userId = request.decoded.userId;
	Models.Contacts.findOne({
		where:{
			id: contactId
		}
	}).then(function(contact){
		if(contact){
			const phoneNumber = contact.phone;
			// Send Message
			msg91.send(phoneNumber, message, function(err, resp){
			    if(err){
			    	// Message failed
			  		responseStatus.Parked.reason.error = "Error in msg API";
			  		response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
			  		
			  	}else{
			  		// Add Message Api
					Models.Messages.create({
						message: message,
						sendTo: contactId,
						sendFrom: userId
					}).then(function() {
				    	response.status(responseStatus.success.code).json({status: true, message: 'Message successfully sent.'});
					}).catch(function(error){
						responseStatus.Parked.reason.error = error;
						response.status(responseStatus.Parked.code).json(responseStatus.Parked.reason);
					});
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

module.exports = {
	getAllMessages: getAllMessages,
	getMessagesById: getMessagesById,
	sendMessage: sendMessage
}