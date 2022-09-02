import { createSlice } from '@reduxjs/toolkit';
const mainSlice = createSlice({
	name: 'app',
	initialState: {
		isHomePageLoading: false,
		productsOfCategory: [],
		categories: [],
		products: []
	},
	reducers: {
		setData(state, action) {
			state.isHomePageLoading = true;
			state.productsOfCategory = action.payload.products;
			state.categories = action.payload.categories;
			state.products = action.payload.products?.reduce((products, category) => {
				if (category.categoryID === 'discount') {
					return [ ...products ];
				}
				return [ ...products, ...category.products ];
			}, []);
		},
		updateProductQuantityEffete: (state, action) => {
			let index = state.products.findIndex((product) => product.productID === action.payload.product.productID);
			state.products[index].quantity = action.payload.product.quantity;
		}
	}
});
export const { actions, reducer } = mainSlice;
export default mainSlice;
