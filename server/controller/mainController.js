import Device from '../models/device';

export const userProfile = (req, res) => {
	res.send('userprofile');
};

export const home = async (req, res) => {
	const deviceObj = [];
	try {
		const deviceData = req.user.deviceList;

		for (let i = 0; i < deviceData.length; i++) {
			console.log('on search!!!');
			await deviceObj.push(
				Device.find({
					PK: deviceData[i]
				})
			);
		}
	} catch (e) {
		console.log('hit error!!!!!');
		console.log(e);
	} finally {
		console.dir(deviceObj);

		res.render('route_main', {
			pageTitle: 'Main',
			topNav: 'remote',
			deviceList: deviceObj | []
		});
	}
};

export const checkElec = (req, res) => {
	console.log('on check elec');
	res.render('checkElec', {
		pageTitle: 'Check Elec',
		topNav: 'checkElec'
	});
};
