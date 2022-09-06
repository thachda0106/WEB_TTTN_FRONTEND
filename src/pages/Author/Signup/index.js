import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Functions } from '~/utils/Function';
import { register } from '~/apiServices/accountServices';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '@mui/material';
const theme = createTheme();

export default function SignUp() {
	const [ firstName, setFirstName ] = useState('');
	const [ lastName, setLastName ] = useState('');
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ email, setEmail ] = useState('');
	const [ error, setError ] = useState({});
	const navigate = useNavigate();
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (handleCheckInput()) return;
		let newAccount = { fullName: firstName + ' ' + lastName, email, username, password, role: 'customer' };
		let rest = await register(newAccount);
		if (rest.status !== 201) {
			Functions.showToast('error', `${rest.response.data}`);
		} else {
			Functions.showToast('success', `${rest.data}`);
			navigate('/sign-in');
		}
		return;
	};
	const handleCheckInput = () => {
		if (firstName.trim() === '') {
			Functions.showToast('error', 'First name không được để trống!');
			return true;
		}
		if (lastName.trim() === '') {
			Functions.showToast('error', 'Last name không được để trống!');
			return true;
		}
		if (username.trim() === '') {
			Functions.showToast('error', 'username không được để trống!');
			return true;
		}
		if (password.trim() === '') {
			Functions.showToast('error', 'password không được để trống!');
			return true;
		}
		if (email.trim() === '') {
			Functions.showToast('error', 'Email không được để trống');
			return true;
		}
		if (!Functions.checkEmail(email.trim())) {
			Functions.showToast('error', 'Email không hợp lệ!');
			return true;
		}
		return false;
	};
	return (
		<ThemeProvider theme={theme}>
			<Breadcrumbs className={'breadcrumb'} aria-label="breadcrumb">
				<Link underline="hover" color="inherit" to="/">
					Home
				</Link>
				<p underline="hover" color="text.primary" aria-current="page">
					Register
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
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
						<span className="text-red-600 my-1 block ">{error.name}</span>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="given-name"
									name="firstName"
									required
									fullWidth
									id="firstName"
									label="First Name"
									autoFocus
									onChange={(e) => setFirstName(e.target.value)}
									value={firstName}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="family-name"
									onChange={(e) => setLastName(e.target.value)}
									value={lastName}
								/>
							</Grid>
							<Grid item xs={12}>
								<span className="text-red-600 my-1 block ">{error.email}</span>
								<TextField
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									onChange={(e) => setEmail(e.target.value)}
									value={email}
								/>
							</Grid>
							<Grid item xs={12}>
								<span className="text-red-600 my-1 block ">{error.username}</span>
								<TextField
									required
									fullWidth
									id="username"
									label="Username"
									name="username"
									autoComplete="username"
									onChange={(e) => setUsername(e.target.value)}
									value={username}
								/>
							</Grid>
							<Grid item xs={12}>
								<span className="text-red-600 my-1 block ">{error.password}</span>
								<TextField
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="new-password"
									onChange={(e) => setPassword(e.target.value)}
									value={password}
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							onClick={handleSubmit}
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign Up
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link href="sign-in" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
