import * as request from '../utils/request';

export const checkSessionLogin = async () => {
	try {
		const res = await request.get('/account/check-session');
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};
export const login = async (account) => {
	try {
		const res = await request.post('/account/login', JSON.stringify(account));
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};
export const register = async (account) => {
	try {
		const res = await request.post('/account/register', JSON.stringify(account));
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};
export const resetPassword = async (email) => {
	try {
		const res = await request.post('/account/reset-password', JSON.stringify({ email }));
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const changePassword = async (username, newPassword, oldPassword) => {
	try {
		const res = await request.put(
			`/account/change-password/${username}`,
			JSON.stringify({ newPassword, oldPassword })
		);
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};
