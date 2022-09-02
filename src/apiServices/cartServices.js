import * as request from '../utils/request';

export const getCartByCustomerID = async (customerID) => {
	try {
		const res = await request.get(`/cart/${customerID}`);
		return res.data;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const addCartItem = async (infoCart) => {
	try {
		const res = await request.post(`/cart`, JSON.stringify(infoCart));
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const decreaseCartItem = async (itemID) => {
	try {
		const res = await request.put(`/cart/${itemID}`);
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};
export const increaseCartItem = async (itemID) => {
	try {
		const res = await request.put(`/cart/increase/${itemID}`);
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const deleteCartItem = async (itemID) => {
	try {
		const res = await request.del(`/cart/${itemID}`);
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const deleteAllCartItem = async (cartID) => {
	try {
		const res = await request.del(`/cart/all/${cartID}`);
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};
