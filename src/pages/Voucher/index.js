import React, { useState, useEffect } from 'react';
import styles from './Voucher.module.scss';
import classNames from 'classnames/bind';
import { Backdrop, Breadcrumbs, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import VoucherItem from '~/components/VoucherItem';
import { getAllVoucher } from '~/apiServices/voucherServices';
const cx = classNames.bind(styles);
const Cart = () => {
	const [ vouchers, setVouchers ] = useState();
	useEffect(() => {
		const getVoucherCollect = async () => {
			let voucherList = await getAllVoucher();
			setVouchers(voucherList);
		};
		getVoucherCollect();
	}, []);

	if (!vouchers)
		return (
			<div>
				<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={!vouchers}>
					<CircularProgress color="inherit" />
				</Backdrop>
			</div>
		);
	return (
		<div className={cx('wrapper', 'w-full')}>
			<div className={cx('container', 'w-full')}>
				{/* BREADCRUMS */}
				<Breadcrumbs className={cx('breadcrumb')} aria-label="breadcrumb">
					<Link underline="hover" color="inherit" to="/">
						Home
					</Link>
					<p underline="hover" color="text.primary" aria-current="page">
						Voucher
					</p>
				</Breadcrumbs>
				<div className={cx('content')}>
					{vouchers.length === 0 && <h2>Không có voucher nào!</h2>}
					{vouchers.map((voucher) => {
						return <VoucherItem key={voucher.voucherID} voucher={voucher} />;
					})}
				</div>
			</div>
		</div>
	);
};

export default Cart;
