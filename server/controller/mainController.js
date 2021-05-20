import Device from '../models/device';

export const userProfile = (req, res) => {
	res.send('userprofile');
};

export const addDevice = (req, res) => {
	console.log('hellow post');
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
		console.log('error: ' + e);
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
	const { PK, name, eUsage, eCharge, eSupply, batteryMax, IP, deviceList } = req.user;

	let resultObj = {
		totalEuseage: 0,
		eSupply: 0,
		batteryLeft: 0,
		solarEsupply: 0
	};

	try {
		resultObj.eSupply += eSupply;
		resultObj.eCharge += eCharge;
		resultObj.eUsage += eUsage;
		resultObj.totalEuseage += getTotalUsage(); // impl
	} catch (e) {
		console.log('error: ' + e);
	} finally {
		res.render('checkElec', {
			pageTitle: 'Check Elec',
			topNav: 'checkElec',
			resultObj
		});
	}
};

const getTotalUsage = () => 0;
