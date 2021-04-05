export const onAuthenticatedId = {
	authenticate: true,
	id: 1,
	email: 'inaki96@naver.com',
	deviceList: [95, 34, 23],
	transActionLog: [
		{
			timeStamp: 123456,
			dealer: 2,
			amount: 100,
			cost: 30000,
			transActionEnd: 12521312
		}
	],
	currentConsumption: 536349,
	solarSupply: 1209312,
	currentDeal: 35398493
};

export const notAuthenticatedId = {
	authenticate: false,
	id: 2,
	email: 'chamchamm@naver.com',
	deviceList: [152, 1234, 123123, 5435],
	transActionLog: [
		{
			timeStamp: 56776,
			dealer: 1,
			amount: 4674,
			cost: 98444,
			transActionEnd: 21314
		}
	],
	currentConsumption: 8293,
	solarSupply: 120,
	currentDeal: -123412
};
