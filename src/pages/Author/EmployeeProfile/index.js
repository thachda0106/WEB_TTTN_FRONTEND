import React, { useRef, useState, useEffect } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import './styles.css';
import { Functions } from '~/utils/Function';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs, Button, Input, InputAdornment, TextField } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { updateProfile } from '~/apiServices/customerServices';
import { changePassword } from '~/apiServices/accountServices';
import PasswordIcon from '@mui/icons-material/Password';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { actions } from '~/state/slices/loginSlice';
import { Link } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const EmployeeProfile = () => {
	const loginStore = useSelector((state) => state.login);
	const dispatch = useDispatch();
	const [ user, setUser ] = useState({
		fullName: loginStore.login.fullName,
		phoneNumber: loginStore.login.phoneNumber,
		gender: loginStore.login.gender,
		dateOfBirth: loginStore.login.dateOfBirth
	});
	const [ avatar, setAvatar ] = useState(loginStore.login.avatar);
	const [ isChange, setIsChange ] = useState(false);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ open, setOpen ] = React.useState(false);
	const [ changePassData, setChangePassData ] = useState({ newPassword: '', confirmPassword: '', oldPassword: '' });
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
		setChangePassData({ newPassword: '', confirmPassword: '', oldPassword: '' });
	};
	const handleChangePass = async () => {
		if (changePassData.oldPassword.trim().length === 0)
			return Functions.showToast('error', 'Mật khẩu cũ không được để trống!');
		if (changePassData.newPassword.trim().length === 0)
			return Functions.showToast('error', 'Mật khẩu không được để trống!');
		if (changePassData.newPassword !== changePassData.confirmPassword) {
			return Functions.showToast('error', 'Mật khẩu không trùng nhau!');
		}
		let res = await changePassword(
			loginStore.login.username,
			changePassData.newPassword,
			changePassData.oldPassword
		);
		if (res.status !== 200) {
			return Functions.showToast('warning', 'Mật khẩu cũ không đúng!');
		} else {
			const action = actions.updateProfile(res.data);
			dispatch(action);
			Functions.showToast('success', 'Cập nhật mật khẩu thành công!');
		}
		setOpen(false);
		setChangePassData({ newPassword: '', confirmPassword: '', oldPassword: '' });
	};
	const abc = useRef();
	const handleOpenFile = () => {
		abc.current.click();
	};

	const handleSelectedFile = async (e) => {
		let file = e.target.files[0];
		var reader = new FileReader();
		setIsChange(true);
		reader.readAsDataURL(file);
		reader.onloadend = async () => {
			setAvatar(reader.result);
			setUser({ ...user, avatar: { base64: reader.result, path: file.name, avatarOld: avatar } });
		};
	};

	const handleChange = (data) => {
		if (!isChange) {
			setIsChange(true);
		}
		setUser((user) => {
			return { ...user, ...data };
		});
	};
	const handleSave = async () => {
		setIsLoading(true);
		if (!user.fullName.trim()) {
			Functions.showToast('warning', 'Họ tên không hợp lệ!');
			setIsLoading(false);
			return;
		}
		if (!Functions.checkPhone(user.phoneNumber)) {
			Functions.showToast('warning', 'Số điện thoại không hợp lệ!');
			setIsLoading(false);
			return;
		}
		let res = await updateProfile({ ...user, employeeID: loginStore.login.employeeID });
		if (res.status !== 201) {
			Functions.showToast('warning', 'Cập nhật thất bại!');
		} else {
			const action = actions.updateProfile(res.data);
			dispatch(action);
			Functions.showToast('success', 'Cập nhật thông tin thành công!');
		}
		setIsLoading(false);
		setIsChange(false);
	};

	useEffect(
		() => {
			setUser({
				fullName: loginStore.login.fullName,
				phoneNumber: loginStore.login.phoneNumber,
				shippingAddress: loginStore.login.shippingAddress,
				gender: loginStore.login.gender
			});
		},
		[ loginStore ]
	);
	return (
		<React.Fragment>
			<Breadcrumbs className={'breadcrumb'} aria-label="breadcrumb">
				<Link underline="hover" color="inherit" to="/">
					Home
				</Link>
				<p underline="hover" color="text.primary" aria-current="page">
					Profile
				</p>
			</Breadcrumbs>
			<div className="profile-background">
				<div className="card">
					<div className="card-header">
						<div className="avatar">
							<img src={avatar} alt="Avatar " className="profile-img" />
							<div
								className="btn-change-avt"
								onClick={() => {
									handleOpenFile();
								}}
							>
								<p>Chọn ảnh đại diện</p>
								<input
									type={'file'}
									className="btn-avt"
									accept="image/*"
									ref={abc}
									onChange={(e) => {
										handleSelectedFile(e);
									}}
								/>
							</div>
						</div>
						<LoadingButton
							disabled={!isChange}
							onClick={handleSave}
							className="btn-voucher bg-colorPrimary"
							endIcon={<SendOutlinedIcon />}
							loading={isLoading}
							loadingPosition="end"
							variant="contained"
						>
							Lưu
						</LoadingButton>
					</div>
					<div className="card-body">
						<div className="item">
							<FormControl className="form-control" variant="standard">
								<FormLabel className="mt-2" id="demo-row-radio-buttons-group-label">
									Họ tên
								</FormLabel>
								<Input
									value={user.fullName}
									onChange={(e) => handleChange({ fullName: e.target.value })}
									className="item-input"
									id="input-with-icon-adornment"
									startAdornment={
										<InputAdornment position="start">
											<AccountCircle />
										</InputAdornment>
									}
								/>
							</FormControl>
						</div>
						<div className="item">
							<FormControl className="form-control" variant="standard">
								<FormLabel className="mt-2" id="demo-row-radio-buttons-group-label">
									Email
								</FormLabel>
								<Input
									type="email"
									className="item-input"
									id="input-with-icon-adornment"
									value={loginStore.login.email}
									disabled={true}
									startAdornment={
										<InputAdornment position="start">
											<AlternateEmailIcon />
										</InputAdornment>
									}
								/>
							</FormControl>
						</div>
						<div className="item">
							<FormControl className="form-control" variant="standard">
								<FormLabel className="mt-2" id="demo-row-radio-buttons-group-label">
									CMND/CCCD:
								</FormLabel>
								<Input
									type="text"
									className="item-input"
									id="input-with-icon-adornment"
									value={loginStore.login.identification}
									disabled={true}
									startAdornment={
										<InputAdornment position="start">
											<AlternateEmailIcon />
										</InputAdornment>
									}
								/>
							</FormControl>
						</div>
						<div className="item">
							<FormControl className="form-control" variant="standard">
								<FormLabel className="mt-2" id="demo-row-radio-buttons-group-label">
									Ngày Sinh:
								</FormLabel>
								<Input
									type="date"
									className="item-input"
									id="input-with-icon-adornment"
									onChange={(e) => handleChange({ dateOfBirth: e.target.value })}
									value={user.dateOfBirth}
									startAdornment={
										<InputAdornment position="start">
											<AlternateEmailIcon />
										</InputAdornment>
									}
								/>
							</FormControl>
						</div>
						<div className="item">
							<FormControl className="form-control" variant="standard">
								<FormLabel className="mt-2" id="demo-row-radio-buttons-group-label">
									Số điện thoại
								</FormLabel>
								<Input
									value={user.phoneNumber}
									onChange={(e) => handleChange({ phoneNumber: e.target.value })}
									className="item-input"
									id="input-with-icon-adornment"
									startAdornment={
										<InputAdornment position="start">
											<PhoneIcon />
										</InputAdornment>
									}
								/>
							</FormControl>
						</div>

						<div className="item">
							<FormControl className="form-control" variant="standard">
								<FormLabel className="mt-2" id="demo-row-radio-buttons-group-label">
									Giới tính
								</FormLabel>
								<RadioGroup
									className="item-input"
									row
									aria-labelledby="demo-row-radio-buttons-group-label"
									name="row-radio-buttons-group"
									defaultValue={user.gender}
									onChange={(e) => {
										handleChange({ gender: e.target.value });
									}}
								>
									<FormControlLabel value="true" control={<Radio />} label="Nam" />
									<FormControlLabel value="false" control={<Radio />} label="Nữ" />
								</RadioGroup>
							</FormControl>
						</div>
						<div className="item">
							<FormControl className="form-control" variant="standard">
								<Button onClick={handleClickOpen} variant="outlined">
									Thay đổi mật khẩu
								</Button>
								<div>
									<Dialog open={open} onClose={handleClose}>
										<DialogTitle>Thay đổi mật khẩu</DialogTitle>
										<DialogContent>
											<DialogContentText>Nhập thông tin</DialogContentText>
											<FormControl className="form-control" variant="standard">
												<FormLabel className="mt-2" id="demo-row-radio-buttons-group-label">
													Mật Khẩu cũ
												</FormLabel>
												<Input
													type="password"
													value={changePassData.oldPassword}
													onChange={(e) => {
														setChangePassData((pre) => {
															return { ...pre, oldPassword: e.target.value };
														});
													}}
													className="item-input"
													id="input-with-icon-adornment"
													startAdornment={
														<InputAdornment position="start">
															<LockOpenIcon />
														</InputAdornment>
													}
												/>
											</FormControl>
											<FormControl className="form-control" variant="standard">
												<FormLabel className="mt-2" id="demo-row-radio-buttons-group-label">
													Mật khẩu mới
												</FormLabel>
												<Input
													type="password"
													value={changePassData.newPassword}
													onChange={(e) => {
														setChangePassData((pre) => {
															return { ...pre, newPassword: e.target.value };
														});
													}}
													className="item-input"
													id="input-with-icon-adornment"
													startAdornment={
														<InputAdornment position="start">
															<PasswordIcon />
														</InputAdornment>
													}
												/>
											</FormControl>
											<FormControl className="form-control" variant="standard">
												<FormLabel className="mt-2" id="demo-row-radio-buttons-group-label">
													Nhập lại mật khẩu
												</FormLabel>
												<Input
													type="password"
													value={changePassData.confirmPassword}
													onChange={(e) => {
														setChangePassData((pre) => {
															return { ...pre, confirmPassword: e.target.value };
														});
													}}
													className="item-input"
													id="input-with-icon-adornment"
													startAdornment={
														<InputAdornment position="start">
															<PasswordIcon />
														</InputAdornment>
													}
												/>
											</FormControl>
										</DialogContent>
										<DialogActions>
											<Button onClick={handleChangePass}>Thay đổi</Button>
											<Button onClick={handleClose}>Hủy</Button>
										</DialogActions>
									</Dialog>
								</div>
							</FormControl>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
export default EmployeeProfile;
