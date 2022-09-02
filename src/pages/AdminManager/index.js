import React, { useLayoutEffect } from 'react';
import { Admin, Resource } from 'react-admin';
import myDataProvider from './AdminProvider';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ProductList, EditProduct, CreateProduct } from '~/components/AdminManger/ProductList';
import { CategoriesList, EditCategory, CreateCategory } from '~/components/AdminManger/CategoriesList';
import { VoucherList, EditVoucher, CreateVoucher } from '~/components/AdminManger/VoucherList';
import { OrderList, OrderDetailShow } from '~/components/AdminManger/OrderList';
import AdminLayout from '~/components/Layouts/AdminLayout';
import HeaderOnly from '~/components/Layouts/HeaderOnly';
import DashBoard from '~/components/AdminManger/DashBoard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DiscountIcon from '@mui/icons-material/Discount';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';

const AdminManager = () => {
	const storeLogin = useSelector((state) => state.login);
	const navigate = useNavigate();
	useLayoutEffect(() => {
		if (storeLogin.login.role === 'customer') return navigate('/not-found');
	});
	return (
		<Admin layout={AdminLayout} dashboard={DashBoard} basename="/admin-manager" dataProvider={myDataProvider}>
			<Resource
				options={{ label: 'Quản lý danh mục' }}
				name="categories"
				list={CategoriesList}
				edit={EditCategory}
				create={CreateCategory}
				icon={CategoryIcon}
			/>
			<Resource
				options={{ label: 'Quản lý sản phẩm' }}
				name="product"
				list={ProductList}
				edit={EditProduct}
				create={CreateProduct}
				icon={InventoryIcon}
			/>
			<Resource options={{ label: 'Quản lý đơn hàng' }} icon={ListAltIcon} name="order" list={OrderList} />
			<Resource
				options={{ label: 'Quản lý mã khuyến mãi' }}
				name="voucher"
				list={VoucherList}
				edit={EditVoucher}
				create={CreateVoucher}
				icon={DiscountIcon}
			/>
		</Admin>
	);
};

export default AdminManager;
