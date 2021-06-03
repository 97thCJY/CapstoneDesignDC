import routes from '../routes';
import Device from '../models/device';
import User from '../models/user';

/**** GET Method ****/
// 원격 페이지 rendering
export const home = async (req, res) => {
	let deviceObjList = []; // 이 데이터를 front에 넘길것
	try {
		const { deviceList } = req.user;

		for (let i = 0; i < deviceList.length; i++) {
			let device = await Device.findOne({ PK: deviceList[i] });

			deviceObjList.push(JSON.parse(JSON.stringify(device)));
		}
	} catch (e) {
		console.log('error: ' + e);
	} finally {
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

// 내 정보 페이지 rendering
export const userProfile = async (req, res) => {
	const { PK, name, email, batteryMax, IP, contact } = req.user;

	if (req.method === "POST") {
		console.log("User POST METHOD~~~~~~~~~");
		const { input_email, input_name, input_contact, input_batteryMax, input_IP } = req.body;

		try {	// DB 수정
			await User.findOneAndUpdate(
				{ PK: PK },
				{
					name: input_name,
					email: input_email,
					batteryMax: input_batteryMax,
					IP: input_IP,
					contact: input_contact
				}
			);
		} catch(e) {
			console.log("DB Error", e);
		} finally {
			res.redirect('/main/user');
		}
	}
	const tmpUser = {
		'PK': PK,
		'name': name,
		'email': email,
		'batteryMax': batteryMax,
		'IP': IP,
		'contact': contact
	}
	res.render('profile', {
		pageTitle: 'Profile',
		user: tmpUser
	});
};

/**** POST Method ****/
// 디바이스 추가 함수
export const addDevice = async (req, res) => {
	const { name, port } = req.body;

	// 입력값 검사
	if (name === '' || port === undefined) {
		// 오류 반환 & 새로고침
		return res.send(
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
			status: true,
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

// 디바이스 삭제 함수
export const deleteDevice = async (req, res) => {
	try {
		const { deleteTarget } = req.body;
		console.log('start delete');
		const target = await Device.findOne({ name: deleteTarget });
		const tarPK = target.PK;

		await Device.deleteOne({ name: deleteTarget });
		const modList = req.user.deviceList;
		const idx = modList.indexOf(tarPK);
		modList.splice(idx, 1);
		await User.findOneAndUpdate(
			{ PK: req.user.PK },
			{ deviceList: modList }
		);
	} catch (e) {
		console.log(e);
	} finally {
		res.redirect(routes.main);
	}
};


// 원격 기기 제어 함수
export const remoteOnOff = async (req, res) => {
	const {productId} = req.body;

	try{
		let device = await Device.findOne({PK : productId});
		await Device.findOneAndUpdate({PK : productId} , {
			status : device.status ? false : true
		})
		device = await Device.findOne({PK : productId});
	} catch(e){
		console.log(e);
	} finally{
		res.redirect(routes.main);
	}
};

const getTotalUsage = () => 0;

export const deviceModification = async (req, res) => {
	const { modName, name } = req.body;

	try {
		await Device.findOneAndUpdate(
			{ name: name },
			{ name: modName }
		);
		console.log(await Device.find({}));
	} catch (e) {
		console.log(e);
	} finally {
		res.redirect(routes.main);
	}
};

export const status = (req, res) => {
	console.log('on status');
	res.render('transactionStatus', {
		pageTitle: 'Progress'
	});
};
