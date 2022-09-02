import React, { useState, useEffect, useLayoutEffect } from 'react';
import styles from './MyOrder.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '@mui/material';
import { getAllOrderCustomer, getAllOrderForStatus } from '~/apiServices/orderServices';
import { Backdrop, CircularProgress } from '@mui/material';
import OrderItem from '~/components/OrderItem';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';

// import { orderCancel } from '~/apiServices/orderServices';
const cx = classNames.bind(styles);
const MyOrder = () => {
	const loginStore = useSelector((state) => state.login);
	const [ orders, setOrders ] = useState([]);
	const [ ordersOfPage, setOrdersOfPage ] = useState([]);
	const [ page, setPage ] = useState(1);
	const [ isPending, setIsPending ] = useState(true);
	const [ filter, setFilter ] = useState('all');
	const maxRow = 4;
	useLayoutEffect(
		() => {
			const loadingsOrderCustomer = async () => {
				let ordersCall;
				if (filter === 'all') {
					ordersCall = await getAllOrderCustomer(loginStore.login.customerID);
				} else ordersCall = await getAllOrderForStatus(filter, loginStore.login.customerID);
				setOrders(ordersCall);
				setIsPending(false);
				setOrdersOfPage(ordersCall.slice((page - 1) * maxRow, (page - 1) * maxRow + maxRow));
			};
			loadingsOrderCustomer();
		},
		[ filter ]
	);
	useEffect(
		() => {
			if (!isPending) {
				setOrdersOfPage(orders.slice((page - 1) * maxRow, (page - 1) * maxRow + maxRow));
			}
		},
		[ page ]
	);
	useEffect(
		() => {
			const loadingsOrderCustomer = async () => {
				let orders = await getAllOrderCustomer(loginStore.login.customerID);
				setOrders(orders);
				setOrdersOfPage(orders.slice((page - 1) * maxRow, (page - 1) * maxRow + maxRow));
			};
			loadingsOrderCustomer();
		},
		[ loginStore.isLogin ]
	);
	return (
		<div className={cx('wrapper', 'w-full')}>
			<div className={cx('container', 'w-full')}>
				<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isPending}>
					<CircularProgress color="inherit" />
				</Backdrop>
				{/* BREADCRUMS */}
				<Breadcrumbs className={cx('breadcrumb')} aria-label="breadcrumb">
					<Link underline="hover" color="inherit" to="/">
						Home
					</Link>
					<p underline="hover" color="text.primary" aria-current="page">
						My Order
					</p>
				</Breadcrumbs>
				<h2>
					<span className="text-colorPrimary font-semibold
						text-2lg ">Danh sách đơn hàng của bạn</span>
				</h2>
				<select
					onChange={(e) => {
						setFilter(e.target.value);
					}}
					name="Trạng thái đơn hàng"
					id="orderStatus"
				>
					<option value="all">Tất cả</option>
					<option value="PENDING">Chờ duyệt</option>
					<option value="DELIVERING">Đang giao</option>
					<option value="RECEIVED">Đã giao</option>
					<option value="CANCELED">Đã hủy</option>
				</select>
				{!isPending && orders.length === 0 && <div> Không có đơn hàng nào!</div>}
				{!isPending &&
				orders.length > 0 && (
					<React.Fragment>
						<div className={cx('content min-h-[400px]')}>
							{ordersOfPage.map((order) => {
								return <OrderItem key={order.orderID} order={{ ...order }} />;
							})}
						</div>
						<Stack spacing={2}>
							<Pagination
								onChange={(e) => {
									setPage(+e.target.innerText);
								}}
								count={Math.ceil(orders.length / maxRow)}
								color="primary"
							/>
						</Stack>
					</React.Fragment>
				)}
			</div>
		</div>
	);
};

export default MyOrder;
