import * as request from '../utils/request';

export const getAllOrder = async () => {
	try {
		const res = await request.get(`/order`);
		return res.data;
	} catch (error) {
		console.log(error);
		return error;
	}
};
export const getAllOrderCustomer = async (customerID) => {
	try {
		const res = await request.get(`/order/customer/${customerID}`);
		return res.data;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const getAllOrderForStatus = async (orderStatus, customerID) => {
	try {
		const res = await request.get(`/order/status/${orderStatus}?customerID=${customerID}`);
		return res.data;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const addOrder = async ({ cartID, customerID, vouchersIDApply, ...rest }) => {
	try {
		const res = await request.post(`/order/${cartID}`, JSON.stringify({ customerID, vouchersIDApply, ...rest }));
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const orderCancel = async (orderID, employeeID) => {
	try {
		const res = await request.put(`/order/canceled/${orderID}`, JSON.stringify({ employeeID }));
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const orderStatusUpdate = async (orderID, orderStatus, employeeID) => {
	try {
		const res = await request.put(`/order/${orderID}`, JSON.stringify({ orderStatus, employeeID }));
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const addOrderPayOnline = async ({ data, info }) => {
	try {
		const res = await request.post(`/order/pay-online/${info.cartID}`, JSON.stringify({ data, info }));
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const turnoverOrder = async (dayStart, dayEnd) => {
	try {
		const res = await request.post(`/order/turnover/date`, JSON.stringify({ dayStart, dayEnd }));
		return res.data;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const turnoverYearDataChart = async (year) => {
	try {
		const res = await request.post(`/order/turnover/year`, JSON.stringify({ year }));
		return res.data;
	} catch (error) {
		console.log(error);
		return error;
	}
};
