import routes from '../routes';
import Device from '../models/device';
import User from '../models/user';

export const userProfile = (req, res) => {
	res.send('userprofile');
};

/**** GET Method ****/
// 원격 페이지 rendering
export const home = async (req, res) => {
	const deviceObjList = [];
	try {
		const deviceData = req.user.deviceList;		// 해당 User의 device pk목록

		let tmp = await Device.findOne({PK:deviceData[i]});
		for (var i = 0; i < deviceData.length; i++) {
			let tmp = await Device.findOne({ PK: deviceData[i] });
			deviceObjList.push(tmp);
		}
	} catch (e) {
		console.log('error: ' + e);
	} finally {
		res.render('route_main', {
			pageTitle: 'Main',
			topNav: 'remote',
			deviceList: deviceObjList
		});
		console.log(deviceObjList);
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

/**** POST Method ****/
// 디바이스 추가 함수
export const addDevice = async (req, res) => {
	const {name, port} = req.body;

	// 입력값 검사
	if (name === "" || port === undefined) {
		// 오류 반환 & 새로고침
		res.send('<script type="text/javascript">alert("전자기기 이름 또는 포트를 선택해주세요.");location.href="/";</script>');
	}
	
	console.log("디바이스 추가\n이름: " + name + " | 포트: " + port);

	//////////////////////////////////
	// 작업 필요 : DB검사 (포트 겹치는게 있는지) //
	/////////////////////////////////

	// DB저장 및 리턴값 반환
	try {
		// device 저장
		const newDevice = await Device.create({
			name,
			port,
			status: false
		});

		// user의 deviceList 수정
		const user = req.user;
		const deviceDataList = req.user.deviceList;

		deviceDataList.push(newDevice.PK);
		user.deviceList = deviceDataList;
		user.save();

		res.redirect(routes.home);
	} catch (e) {
		res.send('<script type="text/javascript">alert("오류 발생: ' + e + '");location.href="/";</script>');
	}
};


const getTotalUsage = () => 0;