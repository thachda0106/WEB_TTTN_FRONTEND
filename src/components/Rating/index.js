import React from 'react';
import classNames from 'classnames/bind';
import styles from './Rating.module.scss';
const cx = classNames.bind(styles);
const Rating = ({ rating }) => {
	return (
		<div className={cx('content')}>
			<h3>Đannh giá sản phẩm</h3>
		</div>
	);
};

export default Rating;
