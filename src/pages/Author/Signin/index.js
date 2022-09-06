import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from '~/apiServices/accountServices';
import { getCartByCustomerID } from '~/apiServices/cartServices';
import { setCustomerVoucher, getVoucherCustomer } from '~/apiServices/voucherServices';
import { actions } from '~/state/slices/loginSlice';
import { useNavigate } from 'react-router-dom';
import { Functions } from '~/utils/Function';
import { Breadcrumbs } from '@mui/material';
const theme = createTheme();
export default function SignIn() {
	const loginStore = useSelector((state) => state.login);
	const dispatch = useDispatch();
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ error, setError ] = useState('');
	const navigate = useNavigate();
	const handleSubmit = async () => {
		if (username.trim() === '') return Functions.showToast('error', 'Tài khoản không được để trống');
		if (password.trim() === '') return Functions.showToast('error', 'Mật khẩu không được để trống');

		let account = { username, password };
		let rest = await login(account);
		if (rest.status != 200) {
			return Functions.showToast('error', rest.response.data);
		}
		let accountInfo = rest.data.login;
		const action = actions.login(accountInfo);
		dispatch(action);
		if (accountInfo.role === 'customer') {
			let cartOfCustomer = await getCartByCustomerID(accountInfo.customerID);
			const action = actions.setCartOfCustomer(cartOfCustomer);
			dispatch(action);
			let customerVouchers = await getVoucherCustomer(accountInfo.customerID);
			const voucherAction = actions.setCustomerVoucher(customerVouchers);
			dispatch(voucherAction);
		}

		// save cartInfo to localStorage
		// let cartUserInfo = {
		// 	cartID: loginStore.login.cartID,
		// 	cartItems: loginStore.login.cartItems
		// };
		// localStorage.setItem('cartID');
		//
		Functions.showToast('success', 'login success!');
		let backLink = localStorage.getItem('backLink');
		if (backLink) {
			navigate(`${backLink}`);
			localStorage.removeItem('backLink');
		} else navigate(`/`);
	};
	return (
		<ThemeProvider theme={theme}>
			<Breadcrumbs className={'breadcrumb'} aria-label="breadcrumb">
				<Link underline="hover" color="inherit" to="/">
					Home
				</Link>
				<p underline="hover" color="text.primary" aria-current="page">
					Login
				</p>
			</Breadcrumbs>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center'
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<span className="text-red-600">{error}</span>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Username"
							name="email"
							autoComplete="email"
							autoFocus
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button onClick={handleSubmit} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="forgot-password" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="sign-up" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
