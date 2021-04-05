export const userProfile = (req, res) => {
	res.send('userprofile');
};

export const home = (req, res) => {
	res.render('route_main', {
		pageTitle: 'Main'
	});
};

export const checkElec = (req, res) => {
	res.send('check elec');
};
