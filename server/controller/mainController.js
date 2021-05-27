import routes from '../routes';
import Device from '../models/device';
import User from '../models/user';

export const userProfile = (req, res) => {
	res.send('userprofile');
};

/**** GET Method ****/
// 원격 페이지 rendering
export const home = async (req, res) => {
	let deviceObjList = []; // 이 데이터를 front에 넘길것
	try {
		const { deviceList } = req.user;

		for (let i = 0; i < deviceList.length; i++) {
			let device = await Device.find({ PK: deviceList[i] });

			deviceObjList.push(JSON.parse(JSON.stringify(device)));
		}
	} catch (e) {
		console.log('error: ' + e);
	} finally {
		console.log(deviceObjList);
		res.render('route_main', {
			pageTitle: 'Main',
			topNav: 'remote',
			deviceList: deviceObjList
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

/**** POST Method ****/
// 디바이스 추가 함수
export const addDevice = async (req, res) => {
	const { name, port } = req.body;

	// 입력값 검사
	if (name === '' || port === undefined) {
		// 오류 반환 & 새로고침
		res.send(
			'<script type="text/javascript">alert("전자기기 이름 또는 포트를 선택해주세요.");location.href="/";</script>'
		);
	}

	try {
		let deviceList = await Device.find({});

		let PK = deviceList.length == 0 ? 0 : 1;

		// 추가할 device의 PK 지정
		if (PK) {
			PK = 0;

			for (let i = 0; i < deviceList.length; i++) {
				if (PK < deviceList[i].PK) {
					PK = deviceList[i].PK;
				}
			}
		}

		// device 생성
		const newDevice = await Device.create({
			name,
			port,
			status: false,
			PK: PK + 1
		});

		// user의 deviceList 수정
		const user = req.user;
		const newList = user.deviceList;

		newList.push(newDevice.PK);

		await User.findByIdAndUpdate(user.id, {
			$set: {
				deviceList: newList
			}
		});

		res.redirect(routes.home);
	} catch (e) {
		res.send('<script type="text/javascript">alert("오류 발생: ' + e + '");location.href="/";</script>');
	}
};

// 원격 기기 제어 함수
export const remoteOnOff = async (req, res) => {
	console.log(req.body);

	//////////////////////////
	// status 변경 및 DB저장 //
	//////////////////////////

	res.redirect(routes.home);
};

const getTotalUsage = () => 0;
