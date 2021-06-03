import express from 'express';
import { checkElectric, tmp, localArduino, externalArduino } from '../controller/arduinoController';

const arduinoRouter = express.Router();

arduinoRouter.get('/', checkElectric);      // for GET test
arduinoRouter.post('/tmp', tmp);            // for POST test


// Local 전기량 받고 (user_id, 초당 사용량, 배터리 잔량, 초당 충전량)
// 기기 리스트 보내기
arduinoRouter.get('/api/local/:PK/:eUsage/:eCharge/:eSupply', localArduino);

// transaction 상황 받고 (PK, 완료된 양, 속도, 남은 시간)
// transaction status, reqAmount 보내기
arduinoRouter.get('/api/external/:PK/:doneAmount/:speed/:time', externalArduino);

//arduinoRouter.get('*', isUnvalidRoutes);

export default arduinoRouter;
