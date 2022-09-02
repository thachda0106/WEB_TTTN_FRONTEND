import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories } from '~/apiServices/categoriesServices';
import { getProductsOfCategory } from '~/apiServices/productServices';
import { actions } from '~/state/slices/mainSlice';
import ProductsOfCategory from '~/components/Home/ProductsOfCategory';
import { Backdrop, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const Home = () => {
	const appStore = useSelector((state) => state.app);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	// useEffect(() => {
	// 	// const loadingData = async () => {
	// 	// 	let [ categories, products ] = await Promise.all([ getCategories(), getProductsOfCategory(10) ]);
	// 	// 	let setDataAction = actions.setData({ categories, products });
	// 	// 	dispatch(setDataAction);
	// 	// };
	// 	// loadingData();
	// }, []);

	return (
		<div>
			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={!appStore.isHomePageLoading}
			>
				<CircularProgress color="inherit" />
			</Backdrop>
			{!appStore.isHomePageLoading && <ProductsOfCategory.Loading />}
			{appStore.isHomePageLoading &&
				appStore.productsOfCategory.map((data) => {
					return <ProductsOfCategory key={data.categoryID} data={data} />;
				})}
		</div>
	);
};

export default Home;
