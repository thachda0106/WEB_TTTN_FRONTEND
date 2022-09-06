import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { resetPassword } from '~/apiServices/accountServices';
import { Link, useNavigate } from 'react-router-dom';
import { Functions } from '~/utils/Function';
import { Breadcrumbs } from '@mui/material';
const theme = createTheme();
export default function SignIn() {
	// const loginStore = useSelector((state) => state.login);
	const [ email, setEmail ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState('');
	const navigate = useNavigate();
	const handleSubmit = async () => {
		if (email.trim() === '') return Functions.showToast('error', 'Email không được để trống!');
		setLoading(true);
		let rest = await resetPassword(email);
		if (rest.status != 200) {
			setLoading(false);
			return setError(`* ${rest.response.data}`);
		}
		Functions.showToast('success', rest.data);
		return navigate('/sign-in');
	};
	return (
		<ThemeProvider theme={theme}>
			<Breadcrumbs className={'breadcrumb'} aria-label="breadcrumb">
				<Link underline="hover" color="inherit" to="/">
					Home
				</Link>
				<p underline="hover" color="text.primary" aria-current="page">
					Forgot Password
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
							label="Email"
							name="email"
							autoComplete="email"
							autoFocus
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<LoadingButton
							onClick={handleSubmit}
							endIcon={<SendIcon />}
							loading={loading}
							loadingPosition="end"
							variant="contained"
							fullWidth
							sx={{ mt: 3, mb: 2 }}
						>
							Send
						</LoadingButton>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
