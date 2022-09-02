import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ProductsOfCategory.module.scss';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Card from '~/components/Card';
import { Skeleton } from '@mui/material';
import { actions } from '~/state/slices/loginSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);
const ProductsOfCategory = (data) => {
	let { categoryID, name, products } = data.data;
	const loginStore = useSelector((state) => state.login);
	const appStore = useSelector((state) => state.app);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	return (
		<div className={cx('wrapper')}>
			<div className={cx('container')}>
				<div className={cx('categoryBar', 'flex-row-start mb-2 mt-2')}>
					<h2>{name}</h2>
					<div
						onClick={() => {
							let filterAdvanced = {
								asc: true,
								desc: true,
								discountBest: true,
								minPrice: 0,
								maxPrice: 0
							};
							if (categoryID === 'discount') filterAdvanced.discountBest = false;
							let categoryFilter = appStore.categories.reduce((list, category) => {
								return { ...list, [category.categoryID]: true };
							}, {});
							categoryFilter[categoryID] = false;
							let action = actions.setFilterProductHome({ filterAdvanced, categoryFilter });
							dispatch(action);
							navigate('/products');
						}}
						className={cx('flex')}
					>
						Xem tất cả<ChevronRightIcon className={cx('btn-icon')} />
					</div>
				</div>
				<div className={cx('items')}>
					{products.map((product) => {
						return <Card key={product.productID} product={product} />;
					})}
				</div>
			</div>
		</div>
	);
};

const Loading = () => {
	return (
		<div className={cx('wrapper')}>
			<div className={cx('container')}>
				<Skeleton variant="rectangular" className="mb-2 w-full mt-2" height={44} />
				<div className={cx('items', 'mb-10')}>
					{[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ].map((value) => {
						return <Card.Loading key={value} />;
					})}
				</div>
			</div>
		</div>
	);
};

ProductsOfCategory.Loading = Loading;
export default ProductsOfCategory;
