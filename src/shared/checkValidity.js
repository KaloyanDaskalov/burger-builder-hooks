const checkValidity = (value, rules) => {
	let isValid = true;

	if (rules.required) {
		isValid = value.trim() !== '' && isValid;
	}

	if (rules.isEmail) {
		const pattern = /^[\w!#$%&'*+\-=?^_`{|}~]+(\.[\w!#$%&'*+\-=?^_`{|}~]+)*@((([-\w]+\.)+[a-zA-Z]{2,4})|(([0-9]{1,3}\.){3}[0-9]{1,3}))/;
		isValid = pattern.test(value) && isValid;
	}

	if (rules.minLength) {
		isValid = value.length >= rules.minLength && isValid;
	}

	if (rules.maxLength) {
		isValid = value.length <= rules.maxLength && isValid;
	}

	return isValid;
};

export default checkValidity;