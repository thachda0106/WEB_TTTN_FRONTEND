import React, { useState, useEffect } from 'react';
import styles from './ProductHome.module.scss';
import classNames from 'classnames/bind';
import { Backdrop, Breadcrumbs, CircularProgress, Pagination, Stack } from '@mui/material';
import { getAllProducts } from '~/apiServices/productServices';
import { useSelector } from 'react-redux';
import { Functions } from '~/utils/Function';
import Card from '~/components/Card';
const cx = classNames.bind(styles);
const ProductHome = () => {
	const loginStore = useSelector((state) => state.login);
	const [ products, setProducts ] = useState([]);
	const [ isPending, setIsPending ] = useState(true);
	const [ productsShow, setProductsShow ] = useState([]);
	const [ page, setPage ] = useState(1);
	const maxRow = 3;
	const maxCol = 4;
	useEffect(() => {
		let getData = async () => {
			let products = await getAllProducts();
			setProducts(products);
			setIsPending(false);
		};
		getData();
	}, []);
	useEffect(
		() => {
			setProductsShow(
				products.slice((page - 1) * maxRow * maxCol, (page - 1) * maxRow * maxCol + maxRow * maxCol)
			);
		},
		[ page, products ]
	);
	useEffect(
		() => {
			if (loginStore.filter) {
				let productsFilter = [];
				let categoriesID = [];
				for (const categoryID in loginStore.filter.categoryFilter) {
					if (loginStore.filter.categoryFilter[categoryID] === false) {
						categoriesID.push(categoryID);
					}
				}

				if (categoriesID.length > 0) {
					productsFilter = products.reduce((products, p) => {
						if (categoriesID.includes(`${p.categoryID}`)) return [ ...products, p ];
						else return [ ...products ];
					}, []);
				} else productsFilter = products;
				console.log({ productsFilter });

				//
				let filterAdvanced = loginStore.filter.filterAdvanced;
				let sort = false;
				let maxPrice = 0,
					minPrice = 0;
				for (const key in filterAdvanced) {
					if (key === 'maxPrice') {
						maxPrice = filterAdvanced[key];
					} else if (key === 'minPrice') {
						minPrice = filterAdvanced[key];
					} else if (!filterAdvanced[key]) {
						sort = key;
					}
				}
				if (sort === 'discountBest') {
					if (productsFilter.length === 0) {
						productsFilter = products;
					}
					let productsNoDiscount = [];
					let productsDiscount = productsFilter.filter((p) => {
						if (Functions.checkDiscount(p)) return true;
						else productsNoDiscount.push(p);
						return false;
					});
					productsDiscount = productsDiscount.sort((a, b) => {
						return a.discountPercent - a.discountPercent;
					});
					productsNoDiscount = productsNoDiscount.sort((a, b) => {
						return Functions.getPriceOrder(a) - Functions.getPriceOrder(b);
					});
					productsFilter = [ ...productsDiscount, ...productsNoDiscount ];
					console.log(productsFilter);
				} else {
					productsFilter = productsFilter.sort((a, b) => {
						if (sort === 'asc') return Functions.getPriceOrder(a) - Functions.getPriceOrder(b);
						if (sort === 'desc') return Functions.getPriceOrder(b) - Functions.getPriceOrder(a);
					});
				}
				if (minPrice !== 0) {
					productsFilter = productsFilter.filter((p) => {
						let priceOrderProduct = Functions.getPriceOrder(p);
						return priceOrderProduct >= minPrice ? true : false;
					});
				}
				if (maxPrice !== 0) {
					productsFilter = productsFilter.filter((p) => {
						let priceOrderProduct = Functions.getPriceOrder(p);
						return priceOrderProduct <= maxPrice ? true : false;
					});
				}
				//
				setProductsShow(productsFilter);
			}
		},
		[ loginStore.filter, products ]
	);
	console.log({ products, productsShow });

	return (
		<div className={cx('wrapper')}>
			<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isPending}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<h2 className={cx('text-2xl font-normal py-2 px-2 ')}>Danh sách sản phẩm</h2>
			{productsShow.length == 0 && <div>Không có sản phẩm nào</div>}
			<div className={cx('container')}>
				<div className={cx('product-list')}>
					{productsShow.map((product) => {
						return <Card smallSize={true} key={product.productID} product={product} />;
					})}
				</div>
				<Stack spacing={2}>
					<Pagination
						onChange={(e) => {
							setPage(+e.target.innerText);
						}}
						count={Math.ceil(products.length / (maxRow * maxCol))}
						color="primary"
						// disabled = {loginStore.filter ? }
					/>
				</Stack>
			</div>
		</div>
	);
};

export default ProductHome;
