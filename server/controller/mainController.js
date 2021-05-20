import Device from '../models/device';

export const userProfile = (req, res) => {
	res.send('userprofile');
};

// 원격 페이지 rendering
export const home = async (req, res) => {
	const deviceObj = [];
	try {
		const deviceData = req.user.deviceList;

		for (let i = 0; i < deviceData.length; i++) {
			await deviceObj.push(
				Device.find({
					PK: deviceData[i]
				})
			);
		}
	} catch (e) {
		console.log("error: " + e);
	} finally {
		res.render('route_main', {
			pageTitle: 'Main',
			topNav: 'remote',
			deviceList: deviceObj | []
		});
	}
};

// 전력확인 페이지 rendering
export const checkElec = async (req, res) => {
	const checkObj = [];

	try {
		console.log("searching");
	} catch (e) {
		console.log("error: " + e);
	} finally {
		console.dir(checkObj);

		res.render('checkElec', {
			pageTitle: 'Check Elec',
			topNav: 'checkElec',
			checkList: checkObj | []
		});
	}
};
