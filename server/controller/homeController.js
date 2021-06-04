import passport from 'passport';
import routes from '../routes';
import User from '../models/user';

export const home = (req, res) => {
	res.redirect(routes.login);
};

export const getLogIn = (req, res) => {
	res.render('login', { pageTitle: 'Log In' });
};

export const message = (req, res) => {
	const {params: { message }}= req;
	res.render('message', { message: message });
}

export const postLogIn = passport.authenticate('local', {
	failureRedirect: routes.login,
	successRedirect: routes.main
});

export const logOut = (req, res) => {
	req.logout();
	res.redirect(routes.login);
};

export const join = (req, res) => {
	res.render('signUp', { pageTitle: 'Sign Up' });
};

export const postJoin = async (req, res) => {
	const { email, password, verifyPassword, name, contact, batteryMax } = req.body;

	try {
		const ulist = await User.find({});
		let PK = ulist.length == 0 ? 0 : 1;
		if (PK) {	// auto-increament
			PK = 0;
			for (let i = 0; i < ulist.length; i++) {
				if (ulist[i].PK > PK) {
					PK = ulist[i].PK;
				}
			}
		}
		const user = await User({
			name,
			email,
			password,
			contact,
			PK: PK + 1,
			batteryMax
			//	deviceList: []
		});
		await User.register(user, password);
		console.log('register finish!!');
		res.redirect(routes.home);
	} catch (e) {
		console.log('❌ error occured on function:: postJoin');
		res.redirect(routes.join);
	}
};