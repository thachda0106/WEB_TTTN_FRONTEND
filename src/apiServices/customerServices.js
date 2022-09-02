import * as request from '../utils/request';

export const updateProfile = async (updateInfo, customerID) => {
	try {
		let res;
		if (updateInfo.employeeID) {
			res = await request.put(`/customer/${updateInfo.employeeID}`, JSON.stringify(updateInfo));
		} else res = await request.put(`/customer/${customerID}`, JSON.stringify(updateInfo));
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};
