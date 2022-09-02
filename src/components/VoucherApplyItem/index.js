import React, { useState } from 'react';
import styles from './VoucherApplyItem.module.scss';
import classNames from 'classnames/bind';
import { Button } from '@mui/material';
import { Functions } from '~/utils/Function';
const cx = classNames.bind(styles);
const VoucherApplyItem = ({ voucher, handleApplyVoucher }) => {
	const [ voucherShow, setVoucherShow ] = useState(voucher);
	const handleChange = () => {
		handleApplyVoucher(voucherShow.voucherID, !voucherShow.isApply, voucherShow);
	};
	return (
		<div className={cx('wrapper shadow-lg p-4', 'flex justify-between ')}>
			<div>
				<img src={voucherShow.thumbnail} width={50} height={50} />
				<p className={'font-medium'}>{voucherShow.nameProduct}</p>
				<p className={'font-medium'}>{voucherShow.title}</p>
				<p className={'font-medium'}>
					Giảm <span className="text-red-600 ">{voucherShow.discountPercent * 100}%</span> cho sản phẩm Giảm
					tối đa <span className="text-red-600 ">{Functions.toVND(voucherShow.maxDiscountValue)}</span>
				</p>
			</div>
			<button
				className="px-4 py-2 bg-colorPrimary rounded ml-3 min-w-[50px] "
				onClick={handleChange}
				color="primary"
			>
				<span className="text-white font-medium">{!voucherShow.isApply ? 'Dùng' : 'Hủy '}</span>
			</button>
		</div>
	);
};

export default VoucherApplyItem;
