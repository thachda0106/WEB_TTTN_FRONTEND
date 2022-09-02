import * as request from '../utils/request';

export const getAllProducts = async () => {
	try {
		const res = await request.get(`/product`);
		return res.data;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const getProductsOfCategory = async (limit) => {
	try {
		const res = await request.get(`/product/home?limit=${limit}`);
		return res.data;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const searchProducts = async (text) => {
	try {
		const res = await request.get(`/product/search/query?search=${text}`);
		return res.data;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const findProductByID = async (productID) => {
	try {
		const res = await request.get(`/product/${productID}`);
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const addRatingProduct = async (rating) => {
	try {
		const res = await request.post(`/product/rating`, JSON.stringify(rating));
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const addCommentProduct = async (comment) => {
	try {
		const res = await request.post(`/product/comment`, JSON.stringify(comment));
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const addReplyComment = async (reply) => {
	try {
		const res = await request.post(`/product/comment/reply`, JSON.stringify(reply));
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};
export const deleteReplyComment = async (replyID) => {
	try {
		const res = await request.del(`/product/comment/reply/${replyID}`);
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};
export const updateReplyComment = async (replyID, content) => {
	try {
		const res = await request.put(`/product/comment/reply/${replyID}`, JSON.stringify({ content }));
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const deleteCommentProduct = async (commentID) => {
	try {
		const res = await request.del(`/product/comment/${commentID}`);
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const updateCommentProduct = async (commentID, content) => {
	try {
		const res = await request.put(`/product/comment/${commentID}`, JSON.stringify({ content }));
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};
