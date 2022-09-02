import { configureStore } from '@reduxjs/toolkit';
import { reducer as loginReducer } from './slices/loginSlice';
import { reducer as mainReducer } from './slices/mainSlice';
const store = configureStore({
	reducer: {
		app: mainReducer,
		login: loginReducer
	}
});
export default store;
