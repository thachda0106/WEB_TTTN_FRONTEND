import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles';
import { Provider } from 'react-redux';
import store from './state/store';
import { ToastContainer } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { actions as loginActions } from '~/state/slices/loginSlice';
import { checkSessionLogin } from '~/apiServices/accountServices';
import { getCartByCustomerID } from '~/apiServices/cartServices';
import { getVoucherCustomer } from '~/apiServices/voucherServices';
import { getCategories } from '~/apiServices/categoriesServices';
import { getProductsOfCategory } from '~/apiServices/productServices';
import { actions } from '~/state/slices/mainSlice';
const root = ReactDOM.createRoot(document.getElementById('root'));
const GlobalEvent = ({ children }) => {
	const loginStore = useSelector((state) => state.login);
	const dispatch = useDispatch();
	useEffect(() => {
		//
		const loadingData = async () => {
			let [ categories, products ] = await Promise.all([ getCategories(), getProductsOfCategory(10) ]);
			let setDataAction = actions.setData({ categories, products });
			dispatch(setDataAction);
		};
		loadingData();
		const handleCheckSessionLogin = async () => {
			if (document.cookie.includes('token')) {
				let rest = await checkSessionLogin();
				if (rest.status === 200) {
					let action = loginActions.login(rest.data);
					dispatch(action);
				} else {
					let action = loginActions.logout({});
					dispatch(action);
				}
				if (rest.data.role == 'customer') {
					let cartOfCustomer = await getCartByCustomerID(rest.data.customerID);
					const cartAction = loginActions.setCartOfCustomer(cartOfCustomer);
					dispatch(cartAction);
					//
					let customerVouchers = await getVoucherCustomer(rest.data.customerID);
					const voucherAction = loginActions.setCustomerVoucher(customerVouchers);
					dispatch(voucherAction);
				}
			}
		};
		const evenOnload = async (event) => {
			if (!loginStore.isLogin) await handleCheckSessionLogin();
		};
		window.addEventListener('load', evenOnload);
		return () => {
			window.removeEventListener('load', evenOnload);
		};
	}, []);
	return <div>{children}</div>;
};
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<GlobalEvent>
				<GlobalStyles>
					<ToastContainer
						position="top-right"
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
					/>
					<App />
				</GlobalStyles>
			</GlobalEvent>
		</Provider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
