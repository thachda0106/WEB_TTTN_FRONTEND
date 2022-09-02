import React, { useState, useEffect } from 'react';
import styles from './MyVoucher.module.scss';
import classNames from 'classnames/bind';
import { Breadcrumbs } from '@mui/material';
import { Link } from 'react-router-dom';
import MyVoucherItem from '~/components/MyVoucherItem';
import { useSelector } from 'react-redux';
const cx = classNames.bind(styles);
const Cart = () => {
	const loginStore = useSelector((state) => state.login);
	const [ vouchers, setVouchers ] = useState(() => {
		if (!loginStore.login.vouchers) return [];
		return loginStore.login.vouchers.filter((voucher) => !voucher.isUsed);
	});
	console.log(vouchers);
	return (
		<div className={cx('wrapper', 'w-full')}>
			<div className={cx('container', 'w-full')}>
				{/* BREADCRUMS */}
				<Breadcrumbs className={cx('breadcrumb')} aria-label="breadcrumb">
					<Link underline="hover" color="inherit" to="/">
						Home
					</Link>
					<p underline="hover" color="text.primary" aria-current="page">
						My Voucher
					</p>
				</Breadcrumbs>
				<h2>
					Danh sách voucher của bạn{' '}
					<Link to="/voucher">
						<span className="text-colorPrimary font-semibold
						text-lg cursor-pointer ">
							(Đi thu thập voucher)
						</span>
					</Link>
				</h2>
				<div className={cx('content')}>
					{vouchers.length === 0 && <h2>Không có voucher nào!</h2>}
					{vouchers.map((voucher) => {
						return <MyVoucherItem key={voucher.voucherID} voucher={voucher} />;
					})}
				</div>
			</div>
		</div>
	);
};

export default Cart;
