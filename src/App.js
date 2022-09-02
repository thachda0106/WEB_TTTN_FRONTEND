import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRouters, privateRouters } from '~/router';
import { DefaultLayout } from '~/components/Layouts';
import { useSelector, useDispatch } from 'react-redux';
import { actions as loginActions } from '~/state/slices/loginSlice';
import { checkSessionLogin } from '~/apiServices/accountServices';
import { getCartByCustomerID } from '~/apiServices/cartServices';
function App() {
	const loginStore = useSelector((state) => state.login);
	const dispatch = useDispatch();
	useEffect(() => {
		const handleCheckSessionLogin = async () => {
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
				const action = loginActions.setCartOfCustomer(cartOfCustomer);
				dispatch(action);
			}
		};
		const evenOnload = (event) => {
			if (!loginStore.isLogin) handleCheckSessionLogin();
			console.log({ event });
		};
		window.addEventListener('load', evenOnload);
		return () => {
			window.removeEventListener('load', evenOnload);
		};
	}, []);
	return (
		<Router>
			<div className="App">
				<Routes>
					{publicRouters.map((route, index) => {
						let Layout = DefaultLayout;
						if (route.layout) {
							Layout = route.layout;
						} else if (route.layout === null) {
							Layout = Fragment;
						}
						const Page = route.component;
						return (
							<Route
								key={index}
								path={route.path}
								element={
									<Layout>
										<Page />
									</Layout>
								}
							/>
						);
					})}

					{privateRouters.map((route, index) => {
						let Layout = Fragment;
						const Page = route.component;
						return (
							<Route
								key={index}
								path={route.path}
								element={
									<Layout>
										<Page />
									</Layout>
								}
							/>
						);
					})}
				</Routes>
			</div>
		</Router>
	);
}

export default App;
