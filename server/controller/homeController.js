export const home = (req, res) => {
	res.send('in home');
};

export const logIn = (req, res) => {
	res.render('login', {
		pageTitle: 'Login'
	});
};

export const logOut = (req, res) => {
	res.send('in logout');
};

export const join = (req, res) => {
	res.render('signUp', {
		pageTitle: 'Sign Up'
	});
};
