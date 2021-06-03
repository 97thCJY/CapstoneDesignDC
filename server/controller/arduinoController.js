import Device from '../models/device';
import User from '../models/user';

// GET 테스트용
export const checkElectric = (req, res) => {
    console.log("hi get");
    res.status(200);
    return res.send("999");
    // const response = {
    //     success: 1
    // }
    // return res.json(response);
}

// POST 테스트용
export const tmp = (req, res) => {
    console.log("hi post");
    res.status(200);
    return res.send("999");
}

// 전기량 받기
export const getElec = async (req, res) => {
    const { params: { PK, eUsage, eCharge, eSupply }} = req;
    
    try {	// DB 수정
        await User.findOneAndUpdate(
            { PK: PK },
            {
                eUsage: eUsage,
                eCharge: eCharge,
                eSupply: eSupply
            }
        );
    } catch(e) {
        console.log("DB Error", e);
        res.status(500);
        return res.send("error");
    } finally {
        res.status(200);
        return res.send("success");
    }
}