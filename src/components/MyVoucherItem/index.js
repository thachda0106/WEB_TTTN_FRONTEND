import React, { useState, useEffect } from 'react';
import styles from './MyVoucherItem.module.scss';
import classNames from 'classnames/bind';
import { Functions } from '~/utils/Function';
import { findProductByID } from '~/apiServices/productServices';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
const cx = classNames.bind(styles);
const VoucherItem = ({ voucher }) => {
	const loginStore = useSelector((state) => state.login);
	const [ product, setProduct ] = useState();
	useEffect(() => {
		const findProduct = async () => {
			let rest = await findProductByID(voucher.productID);
			setProduct(rest.data);
		};
		findProduct();
	}, []);
	if (!product) return <div />;
	return (
		<div className={cx('container flex flex-row justify-between  shadow-xl gap-4 p-4 hover:cursor-pointer')}>
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
			<Button className="self-center mr-2 " variant="contained" color="success">
				<Link to={`/product/${product.productID}`}> Sử dụng ngay</Link>
			</Button>
		</div>
	);
};

export default VoucherItem;
