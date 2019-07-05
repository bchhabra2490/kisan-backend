// Common Status used in responses
var authentication=
{
	code : 401,
	reason     :	{
		'message': 'UnAuthorised',
		'status': false
	}
};

var field_missing=
{
	code : 400,
	reason    :     {
		'message' : 'Invalid Request, Required Params Missing',
		'status'  : false,
	}
};

var wrong_field=
{
	code : 406,
	reason    :     {
		'message' : 'Invalid Request, Value Not Acceptable ',
		'status'  : false,
	}
};

var server_failiure_error_Parked=
{
	code : 503,
	reason    :     {
		message : 'There\'s an error processing request.Error has been logged with id',
		id	  :  '',
		status  : false,
	}
};
var server_failiure_mail_Sent=
{
	code : 500,
	reason    :     {
		'message' : 'There\'s an error processing request.Error has been shared with respective people',
		'status'  : false,
	}
};
var server_failiure_not_Logged_properly=
{
	code : 508,
	reason    :     {
		'message' : 'There\'s an error processing request.Error Looped around and couldnt be logged properly, please contact at help@tripshire.com for more details',
		'status'  : false,
	}
};
var data_not_found=
{
	code : 404,
	reason    :     {
		'message' : 'Required Content not Found',
		'status'  : false,
	}
};
var success=
{
	code : 200,
	reason    :     {
		'status'  : true,
	}
};
var archived=
{	code : 410,
	reason	: 		{
		'status'	: false,
		'message'	: 	'Resource has been archived'
	}
};
var notAllowed=
{	code : 403,
	reason	: 		{
		'status' 	: 	false,
		'message'	: 	'Not allowed to access this resource'
	}
};
var conflict=
{	code : 409,
	reason	: 		{
		'status' 	: 	false,
		'message'	: 	'Similar resource already exist'
	}
};


module.exports=
{
	authenticationFailure	: authentication,
	fieldMissing           : field_missing,
	wrongField				: wrong_field,
	Parked 					: server_failiure_error_Parked,
	Mailed					: server_failiure_mail_Sent,
	notLogged               : server_failiure_not_Logged_properly,
	noData					: data_not_found,
	success					: success,
	archived				: archived,
	notAllowed				: notAllowed,
	conflict				: conflict
}
