import { createSlice } from '@reduxjs/toolkit';
const loginSlice = createSlice({
	name: 'login',
	initialState: {
		isLogin: false,
		login: {}
	},
	reducers: {
		setFilterProductHome: (state, action) => {
			state.filter = action.payload;
		},
		login: (state, action) => {
			state.isLogin = true;
			state.login = { ...action.payload };
		},
		logout: (state, action) => {
			state.isLogin = false;
			state.login = {};
		},
		updateProfile: (state, action) => {
			state.login = { ...state.login, ...action.payload };
		},
		setCartOfCustomer: (state, action) => {
			state.login = { ...state.login, ...action.payload };
		},
		addCartItems: (state, action) => {
			let itemIndex = state.login.cartItems.findIndex((item) => item.itemID == action.payload.itemID);
			if (itemIndex != -1) {
				state.login.cartItems[itemIndex] = action.payload;
			} else state.login.cartItems = [ ...state.login.cartItems, action.payload ];
		},
		deCreaseQuantityCartItem: (state, action) => {
			let itemIndex = state.login.cartItems.findIndex((item) => item.itemID == action.payload.itemID);
			state.login.cartItems[itemIndex].quantity -= 1;
		},
		inCreaseQuantityCartItem: (state, action) => {
			let itemIndex = state.login.cartItems.findIndex((item) => item.itemID == action.payload.itemID);
			state.login.cartItems[itemIndex].quantity += 1;
		},
		deleteCartItem: (state, action) => {
			let itemIndex = state.login.cartItems.findIndex((item) => item.itemID == action.payload.itemID);
			state.login.cartItems = [
				...state.login.cartItems.slice(0, itemIndex),
				...state.login.cartItems.slice(itemIndex + 1)
			];
		},
		deleteAllCartItem: (state, action) => {
			state.login.cartItems = [];
		},
		setCustomerVoucher: (state, action) => {
			state.login.vouchers = [ ...action.payload ];
		},
		addCustomerVoucher: (state, action) => {
			if (!state.login.vouchers) state.login.vouchers = [];
			state.login.vouchers = [ ...state.login.vouchers, action.payload ];
		},
		setOrderWrap: (state, action) => {
			state.orderWrap = { ...action.payload };
		},
		updateOrder: (state, action) => {
			console.log({ voucheraplly: action.payload.vouchersIDApply });
			if (action.payload.vouchersIDApply.length > 0) {
				for (let i = 0; i < action.payload.vouchersIDApply.length; i++) {
					let index = state.login.vouchers.findIndex(
						(voucher) => voucher.voucherID === action.payload.vouchersIDApply[i]
					);
					if (index !== -1) {
						console.log(index);
						state.login.vouchers[index].isUsed = true;
					}
				}
				console.log({ vouchers: state.login.vouchers });
			}
			state.login.cartItems = [];
			state.login.orderWrap = {};
		},
		updateCartItemQuantityEffete: (state, action) => {
			let index = state.login.cartItems.findIndex(
				(cartItem) => cartItem.itemID === action.payload.cartItem.itemID
			);
			state.login.cartItems[index].quantity = action.payload.product.quantity;
		}
	}
});
export const { actions, reducer } = loginSlice;
export default loginSlice;
