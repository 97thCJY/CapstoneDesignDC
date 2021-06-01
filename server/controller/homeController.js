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

	/* 유효성 검사 */
	// 아이디 또는 비밀번호가 빈칸일 경우
	if (email === "" || password === "") {
		res.status(400);
		return res.render('signUp', { pageTitle: 'Sign Up' });
	}

	// if input_username == "" or input_password1 == "":
	// 	return render(request, 'signup.html', {
	// 		'input_username': input_username,
	// 		'input_phone': input_phone,
	// 		'error': '아이디와 비밀번호를 입력해주세요.'
	// 	})


	// # 이메일 형식 검사
	// email_validator = re.compile('^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
	// if email_validator.match(input_username) == None:
	// 	return render(request, 'signup.html', {
	// 		'input_username': input_username,
	// 		'input_phone': input_phone,
	// 		'error': '잘못된 이메일 형식입니다.'
	// 	})
	// # 전화번호가 빈칸, 문자포함, 10자 이하면 에러
	// if input_phone == "" or str(input_phone).isdigit() == False or len(input_phone)<10:
	// 	return render(request, 'signup.html', {
	// 		'input_username': input_username,
	// 		'input_phone': input_phone,
	// 		'error': '핸드폰번호를 입력해주세요.'
	// 	})
	
	// # 비밀번호 두개가 다를 경우
	// if input_password1 != input_password2:
	// 	return render(request, 'signup.html', {
	// 		'input_username': input_username,
	// 		'input_phone': input_phone,
	// 		'error': '비밀번호가 다릅니다.'
	// 	})
	
	// # 비밀번호 형식 검사 (8자 이상 20자 이하의 숫자, 영문 조합)
	// if len(input_password1) >= 8 and len(input_password1) <= 20 and re.findall('[0-9]+', input_password1) and re.findall('[a-zA-Z]+', input_password1) and not re.findall('[^0-9a-zA-Z]', input_password1):
	
	// 비밀번호 다를경우
	if (password !== verifyPassword) {
		res.status(400);
		return res.render('signUp', { pageTitle: 'Sign Up' });
	}

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
			batteryMax,
			IP: req.ip
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