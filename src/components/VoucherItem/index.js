import React, { useState, useEffect } from 'react';
import styles from './VoucherItem.module.scss';
import classNames from 'classnames/bind';
import { Functions } from '~/utils/Function';
import { findProductByID } from '~/apiServices/productServices';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { collectVoucher } from '~/apiServices/voucherServices';
import { actions } from '~/state/slices/loginSlice';
const cx = classNames.bind(styles);
const VoucherItem = ({ voucher }) => {
	const loginStore = useSelector((state) => state.login);
	const [ product, setProduct ] = useState();
	const dispatch = useDispatch();
	const [ isCollect, setIsCollect ] = useState(() => {
		if (!loginStore.login.vouchers) return false;
		return loginStore.login.vouchers.some((v) => v.voucherID === voucher.voucherID);
	});
	const handleCollectVoucher = async () => {
		if (isCollect) return;
		let rest = await collectVoucher({ customerID: loginStore.login.customerID, voucherID: voucher.voucherID });
		if (rest.status !== 201) return Functions.showToast('error', 'Lỗi thu thập voucher!');
		let action = actions.addCustomerVoucher(rest.data);
		voucher.quantity -= 1;
		dispatch(action);
		setIsCollect(true);
		Functions.showToast('success', 'Thu thập voucher thành công!');
	};
	useEffect(() => {
		const findProduct = async () => {
			let rest = await findProductByID(voucher.productID);
			setProduct(rest.data);
		};
		findProduct();
	}, []);
	if (!product) return <div />;
	console.log(voucher);
	return (
		<div
			className={cx('container flex flex-row justify-between  shadow-xl gap-4 p-4 hover:cursor-pointer', {
				'bg-[#d1d1d16e]': voucher.quantity === 0
			})}
		>
			<div>
				<Link className="flex-row-start" to={`/product/${product.productID}`}>
					<img src={product.thumbnail} alt="image" width="50" height="50" />
					<span className="text-colorGreen hover:underline ">{product.name}</span>
				</Link>

				<p className="text-2xl text-colorPrimary font-medium py-1 ">{voucher.title}</p>
				<p className="text-2xl font-medium py-1 ">
					Giảm <span className="text-red-700"> {voucher.discountPercent * 100}%</span> sản phẩm tối đa{' '}
					<span className="text-red-700"> {Functions.toVND(voucher.maxDiscountValue)}</span>
				</p>
				<p className="text-2xl font-medium py-1 ">
					Voucher có hiệu lực từ {Functions.timestampToDateTime(new Date(voucher.dateStart).getTime())} đến{' '}
					{Functions.timestampToDateTime(new Date(voucher.dateEnd).getTime())}{' '}
				</p>
			</div>

			{voucher.quantity === 0 ? (
				<Button
					disabled={voucher.quantity === 0 ? true : false}
					onClick={handleCollectVoucher}
					className="self-center mr-2 bg-orange-400 "
					variant="contained"
					color="success"
				>
					Hết
				</Button>
			) : (
				<Button
					disabled={isCollect ? true : false}
					onClick={handleCollectVoucher}
					className="self-center mr-2 "
					variant="contained"
					color="success"
				>
					{voucher.quantity !== 0 && isCollect ? 'Đã thu thập' : 'Thu thập ngay'}
				</Button>
			)}
		</div>
	);
};

export default VoucherItem;
