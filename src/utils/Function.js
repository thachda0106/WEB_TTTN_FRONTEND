import { type } from '@testing-library/user-event/dist/type';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const Functions = {
	deleteAllCookies: (name) => {
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	},
	toVND: (price) => {
		let priceStr = price.toString();
		let priceVND = '';
		let dem = 0;
		for (let i = priceStr.length - 1; i >= 0; i--) {
			priceVND = priceStr[i] + priceVND;
			dem += 1;
			if (dem === 3 && i !== 0) {
				dem = 0;
				priceVND = '.' + priceVND;
			}
		}
		return priceVND + '₫';
	},
	showToast: (type, text) => {
		toast[type](text, { position: toast.POSITION.TOP_LEFT, autoClose: 2000 });
	},
	findProduct: (productID, appStore) => {
		let product = appStore.products.find((product) => product.productID == productID);
		return product;
	},
	checkEmail: (text) => {
		const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
		return regex.test(text);
	},
	checkPhone: (text) => {
		const regex = /^0[0-9]{9}$/;
		return regex.test(text);
	},

	checkDiscount: (product) => {
		if (product.discountPercent === null || product.discountPercent === 0) {
			return false;
		}
		let dateEnd = new Date(product.dateDiscountEnd),
			dateStart = new Date(product.dateDiscountStart);
		if (Date.now() > dateEnd.getTime() || Date.now() < dateStart.getTime()) {
			return false;
		}
		return true;
	},

	getPriceOrder: (product) => {
		let price = product.price;
		if (product.discountPercent === null || product.discountPercent === 0) {
			return price;
		}
		let dateEnd = new Date(product.dateDiscountEnd),
			dateStart = new Date(product.dateDiscountStart);
		if (Date.now() > dateEnd.getTime() || Date.now() < dateStart.getTime()) {
			return price;
		}
		return price - price * product.discountPercent;
	},
	getTotalDiscountVoucher: (orderVouchers) => {
		let total = 0;
		for (let i = 0; i < orderVouchers.length; i++) {
			let priceDiscount = orderVouchers[i].voucher.priceOrderProduct * orderVouchers[i].voucher.discountPercent;
			if (priceDiscount > orderVouchers[i].voucher.maxDiscountValue) {
				priceDiscount = orderVouchers[i].voucher.maxDiscountValue;
			}
			total += priceDiscount;
		}
		return total;
	},
	getPriceOrderTotalNoVoucher: (cartItems) => {
		const getPriceOrder = (product) => {
			let price = product.price;
			if (product.discountPercent === null || product.discountPercent === 0) {
				return price;
			}
			let dateEnd = new Date(product.dateDiscountEnd),
				dateStart = new Date(product.dateDiscountStart);
			if (Date.now() > dateEnd.getTime() || Date.now() < dateStart.getTime()) {
				return price;
			}
			return price - price * product.discountPercent;
		};
		let total = 0;
		for (const item of cartItems) {
			let price = getPriceOrder(item.product);
			total += price * item.quantity;
		}
		return total;
	},
	getPriceOrderTotal: (order) => {
		let total = 0;
		for (const orderDetail of order.orderDetails) {
			total += orderDetail.quantity * orderDetail.priceOrder;
		}
		if (order.voucherID) {
			total -= order.discountVoucher;
		}
		return total;
	},
	// Convert timestamp sang ngày, mode để chỉ lấy tháng hoặc lấy năm
	timestampToDate: (timestamp, mode = '') => {
		timestamp = timestamp.toString();
		timestamp = timestamp.length < 11 ? timestamp * 1000 : timestamp;
		timestamp = parseInt(timestamp);
		var theDate = new Date(timestamp);
		if (mode === 'month') return theDate.getMonth() + 1;
		else if (mode === 'year') return theDate.getFullYear();
		else return theDate.getDate() + '/' + Number(theDate.getMonth() + 1) + '/' + theDate.getFullYear();
	},

	// Convert timestamp sang datetime
	timestampToDateTime: (timestamp) => {
		timestamp = timestamp.toString();
		timestamp = timestamp.length < 11 ? timestamp * 1000 : timestamp;
		timestamp = parseInt(timestamp);
		var theDate = new Date(timestamp);
		return (
			theDate.getHours() +
			'h:' +
			theDate.getMinutes() +
			'p ' +
			theDate.getDate() +
			'/' +
			Number(theDate.getMonth() + 1) +
			'/' +
			theDate.getFullYear()
		);
	},
	// Generate otp
	generateOtp: () => {
		let res = '';
		for (let i = 0; i < 4; i++) {
			res += Math.floor(Math.random() * 10);
		}
		return res;
	},

	// Cắt ngắn chuỗi đi
	cropText: (text, length = 25) => {
		if (text.length < length) return text;
		else return text.slice(0, length - 5) + '...';
	},

	// So sánh xem ngày hiện tại có nằm trong khoảng ngày này không
	compareTimeNow: (start, end) => {
		let now = parseInt(new Date().getTime() / 1000);
		if (now < start) return false;
		if (now - end > 86400) return false;
		return true;
	}
};
