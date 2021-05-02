import routes from "../routes";

export const home = (req, res) => {
	res.send('in home');
};

export const getLogIn = (req, res) => {




	res.render('login', {
		pageTitle: 'Login'
	});
};

export const postLogIn = (req , res) =>{

	


}

export const logOut = (req, res) => {
	res.send('in logout');
};

export const join = (req, res) => {
	console.log("on get join");
	res.render('signUp', {
		pageTitle: 'Sign Up'
	});
};

export const postJoin = async (req ,res ) => {

	const {email , password , verifyPassword , name , contact} = req.body;

	if(password !== verifyPassword){
	
		res.status(400);
		res.render('signUp', { pageTitle: 'Sign Up' });


	}else{
		try{
			const user = await User({
				name,email,password,contact
			});

			await User.register(user , password);
			console.log('register finish!!');

			next();


		}catch(e){

			console.log(e);
			console.log('❌ error occured on function:: postJoin');

			res.redirect(routes.home);



		}

	}


}
