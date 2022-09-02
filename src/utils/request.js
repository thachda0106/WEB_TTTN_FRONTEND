import axios from 'axios';
const request = axios.create({
	baseURL: 'http://localhost:8111/api/v1',
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true
});

export const get = async (path, options = {}) => {
	const response = await request.get(path, options);
	return response;
};

export const post = async (path, options = {}) => {
	const response = await request.post(path, options);
	return response;
};

export const del = async (path, options = {}) => {
	const response = await request.delete(path, options);
	return response;
};

export const put = async (path, options = {}) => {
	const response = await request.put(path, options);
	return response;
};

export default request;
