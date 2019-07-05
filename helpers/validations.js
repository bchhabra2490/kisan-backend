const validatePhone = (phone)=>{
	if(!/^[0-9]{10}$/i.test(phone)){
		return false;
	}
	return true;
}

const validateEmail = (email) => {
	if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    	return false
  	}
  	return true
}

module.exports = {
	validatePhone: validatePhone,
	validateEmail: validateEmail
}