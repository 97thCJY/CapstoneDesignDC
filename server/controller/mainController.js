export const userProfile = (req, res) => {
	res.send('userprofile');
};

export const home = (req, res) => {
	res.render('route_main', {
		pageTitle: 'Main'
	});
};

export const checkElec = (req, res) => {
	console.log('on check elec');
	res.render('checkElec',{
		pageTitle: 'Check Elec'
	});

};
