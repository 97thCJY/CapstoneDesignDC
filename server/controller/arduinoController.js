import Device from '../models/device';
import User from '../models/user';

// GET 테스트용
export const checkElectric = (req, res) => {
    console.log("hi get");
    res.status(200);
    return res.status(200).send("1");
}

// POST 테스트용
export const tmp = (req, res) => {
    console.log("hi post");
    res.status(200);
    return res.send("1");
}

// 전기량 받기
export const getElec = async (req, res) => {
    const { params: {
        PK,         // 사용자 PK
        eUsage,     // 전력 사용량
        eCharge,    // 전지 충전량
        eSupply     // 태양광 발전량
    }} = req;

    console.log("[아두이노GET] pk:" + PK + " 사용량:" + eUsage + " 배터리량:" + eCharge + " 발전량:" + eSupply);

    try {	// DB 수정
        await User.findOneAndUpdate({ PK: PK }, {
            eUsage: eUsage,
            eCharge: eCharge / 100,
            eSupply: eSupply
        });
    } catch(e) {
        // console.log("DB Error", e);
        return res.status(501).send("fail");
    } finally {
        return res.status(200).send("success");
    }
}