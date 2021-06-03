import Device from '../models/device';
import User from '../models/user';
import Transaction from '../models/transaction';

// GET 테스트용
export const checkElectric = (req, res) => { console.log("hi get");return res.status(200).send("1"); }
// POST 테스트용
export const tmp = (req, res) => { console.log("hi post"); return res.status(200).send("1"); }

// Local 측정값 받고 : 기기 리스트 보내기
export const localArduino = async (req, res) => {
    const { params: {
        PK,         // 사용자 PK
        eUsage,     // 전력 사용량
        eCharge,    // 전지 충전량
        eSupply     // 태양광 발전량
    }} = req;
    let user;
    let deviceObjList = [];

	try {
        user = await User.findOne({ PK: PK });
		const deviceList = user.deviceList;
        
        // user를 찾지 못함
        if (deviceList === null)
            return res.status(555).send("invalid user");

        // 기기 목록 불러오기
		for (let i = 0; i < deviceList.length; i++) {
			let device = await Device.findOne({ PK: deviceList[i] });
			deviceObjList.push({
                port: device.port,
                status: device.status
            });
		}
	} catch (e) {
        return res.status(555).send("error in user and device");
	}

    // 로그 출력
    let nowDate = new Date();
    console.log("[Local Arduino] pk:" + PK + " 사용량:" + eUsage + " 배터리량:" + eCharge + " 발전량:" + eSupply + "[" + nowDate.toUTCString() + "]");

    try {	// User DB 수정
        await User.findOneAndUpdate({ PK: PK }, {
            eUsage: eUsage,
            eCharge: eCharge / 100,
            eSupply: eSupply
        });
    } catch(e) {
        return res.status(555).send("error in updating user");
    }
    return res.status(200).json(deviceObjList);
}

// External 측정값 받고 (PK, 완료된 양, 속도, 남은 시간) : transaction status, reqAmount, isSeller 보내기
export const externalArduino = async (req, res) => {
    const { params: {
        PK,         // 사용자 PK
        doneAmount, // 완료된 양
        speed,      // 전송 속도
        time        // 남은 시간
    }} = req;

    let nowDate = new Date();
    console.log("[External GET] pk:" + PK + " 완료된양:" + doneAmount + " 전송속도:" + speed + " 남은시간:" + time + "[" + nowDate.toUTCString() + "]");
    
    return res.status(200).send("success");
}