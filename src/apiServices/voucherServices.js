import * as request from '../utils/request';

export const getAllVoucher = async () => {
	try {
		const res = await request.get(`/voucher/collect`);
		return res.data;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const getVoucherCustomer = async (customerID) => {
	try {
		const res = await request.get(`/customer/vouchers/${customerID}`);
		return res.data;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const collectVoucher = async (data) => {
	try {
		const res = await request.post(`/voucher/collect`, JSON.stringify(data));
		console.log(data, { res });
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};
