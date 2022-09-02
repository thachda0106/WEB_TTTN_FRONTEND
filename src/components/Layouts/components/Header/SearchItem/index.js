import React from 'react';
import styles from './SearchItem.module.scss';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);
const SearchItem = ({ product }) => {
	const navigate = useNavigate();
	const handleLink = () => {
		if (window.location.pathname.split('/')[1] === 'product') {
			window.location.href = window.location.origin + '/product/' + product.productID;
		} else navigate('/product/' + product.productID);
	};
	return (
		<div onClick={handleLink} className={cx('wrapper')}>
			<div className={cx('container')}>
				{product && (
					<div className={cx('flex-row-start', 'p-4 cursor-pointer hover:bg-slate-200 ')}>
						<img src={product.thumbnail} className={cx('w-14 h-14 ')} />
						<h4>{product.name}</h4>
					</div>
				)}
			</div>
		</div>
	);
};

export default SearchItem;
