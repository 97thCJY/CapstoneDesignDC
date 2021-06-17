import Device from '../models/device';
import User from '../models/user';
import Transaction from '../models/transaction';

// GET 테스트용
export const checkElectric = (req, res) => { console.log("hi get"); return res.status(200).send("1"); }
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
            return res.status(200).send("invalid user");

        // 기기 목록 불러오기
		for (let i = 0; i < deviceList.length; i++) {
			let device = await Device.findOne({ PK: deviceList[i] });
			deviceObjList.push({
                port: device.port,
                status: device.status
            });
		}
	} catch (e) {
        return res.status(200).send("error in user and device");
	}

    // 로그 출력
    let nowDate = new Date();
    console.log("[Local Arduino] pk:" + PK + " 사용량:" + eUsage + " 배터리량:" + eCharge + " 발전량:" + eSupply + "[" + nowDate.toUTCString() + "]");

    try {	// User DB 수정
        let new_eCharge = user.eCharge - eCharge;
        if (new_eCharge < 0) new_eCharge = 0;
        if (new_eCharge > 100) new_eCharge = 100;

        await User.findOneAndUpdate({ PK: PK }, {
            eUsage: eUsage,
            eCharge: new_eCharge,
            eSupply: eSupply
        });
    } catch(e) {
        return res.status(200).send("error in updating user");
    }

    if (deviceObjList.length === 0)
        return res.status(200).json(deviceObjList);
    else
        return res.status(200).json(deviceObjList);
}

// External 측정값 받고 (PK, 완료된 양, 속도, 남은 시간) : transaction status, reqAmount, isSeller 보내기
export const externalArduino = async (req, res) => {
    let { params: {
        doneAmount,     // 완료된 양
        speed,          // 전송 속도
        time            // 남은 시간
    }} = req;
    let transaction;

    // 로그 출력
    let nowDate = new Date();
    console.log("[External Arduino] 완료된양:" + doneAmount + " 전송속도:" + speed + " 남은시간:" + time + "[" + nowDate.toUTCString() + "]");
    
	try {  // DB 불러오기
        transaction = await Transaction.findOne({ status: 3 });
	} catch (e) {
        return res.status(200).send("error in finding transaction");
	}

    // 거래중 X
    if (transaction == null) {
        console.log("no data");
        const noDataObj = { seller: 0, buyer: 0, amount: 0, amount_send: 0 }
        return res.status(200).json(noDataObj);
    }

    doneAmount = parseInt(doneAmount);
    const returnObj = {
        seller: transaction.seller,
        buyer: transaction.buyer,
        amount: transaction.reqAmount,
        amount_send: doneAmount
    };
    
    // 거래 종료 할지 말지?
    if (returnObj.amount < returnObj.amount_send) {
        try {  // DB 저장
            const changed = await transaction.update({ amount_send: doneAmount, status: 4 });
        } catch (e) {
            return res.status(200).send("error in saving transaction");
        }
    } else {
        try {  // DB 저장
            const changed = await transaction.update({ amount_send: doneAmount });
        } catch (e) {
            return res.status(200).send("error in saving transaction");
        }
    }
    console.log(returnObj);
    return res.status(200).json(returnObj);
}