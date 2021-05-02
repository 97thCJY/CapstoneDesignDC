import passport from "passport";
import routes from "../routes";
import User from '../models/user';

export const home = (req, res) => {
	res.send('in home');
};

export const getLogIn = (req, res) => {

	res.render('login', {
		pageTitle: 'Log In'
	});
};

export const postLogIn = passport.authenticate('local' , {
		failureRedirect: routes.login,
		successRedirect: routes.main
	})

export const logOut = (req, res) => {

	req.logout();

	res.redirect(routes.login);

};

export const join = (req, res) => {
	console.log("on get join");
	res.render('signUp', {
		pageTitle: 'Sign Up'
	});
};

export const postJoin = async (req ,res  ) => {

	const {email , password , verifyPassword , name , contact} = req.body;

	if(password !== verifyPassword){
	
		res.status(400);
		res.render('signUp', { pageTitle: 'Sign Up' });


	}else{
		try{

			const user = await User({
				name,email,password,contact,
				PK: 0,
				batteryMax: 0,
				IP: req.ip
			});

			await User.register(user , password);
			console.log('register finish!!');

			res.redirect(routes.home);

		}catch(e){

			console.log(e);
			console.log('❌ error occured on function:: postJoin');

			res.redirect(routes.join);



		}

	}


}


///  call backs 
