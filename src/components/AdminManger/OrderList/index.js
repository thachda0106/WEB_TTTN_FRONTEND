import React, { useState, useEffect, useMemo } from 'react';
import styles from './OrderList.module.scss';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import {
	Edit,
	EditButton,
	List,
	TextField,
	TextInput,
	DateField,
	ArrayField,
	ArrayInput,
	ImageField,
	RichTextField,
	ReferenceField,
	Labeled,
	ImageInput,
	DateTimeInput,
	NumberInput,
	SimpleFormIterator,
	ChipField,
	FileInput,
	FormDataConsumer,
	SimpleShowLayout,
	TabbedForm,
	FormTab,
	Create,
	NumberField,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	AutocompleteInput,
	DeleteButton,
	FunctionField,
	SearchInput,
	SelectField,
	Pagination,
	DateInput,
	Show,
	DatagridRow
} from 'react-admin';
import { Datagrid, DatagridBody, RecordContextProvider } from 'react-admin';
import { TableCell, TableRow, Checkbox, Button, TableHead, Box, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { orderStatusUpdate, orderCancel } from '~/apiServices/orderServices';
import { Functions } from '~/utils/Function';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
const cx = classNames.bind(styles);
const MyDatagridRow = ({ record, id, onToggleItem, children, selected, selectable }) => {
	const loginStore = useSelector((state) => state.login);
	const [ recordRow, setRecordRow ] = useState(record);
	const [ isHidden, setIsHidden ] = useState(() => {
		if (recordRow.orderStatus === 'Đã giao' || recordRow.orderStatus === 'Đã hủy') return true;
		return false;
	});
	const [ isRowHidden, setIsRowHidden ] = useState(false);
	const [ open, setOpen ] = useState(false);
	let processOrderStatus = { 'Chờ duyệt': 'DELIVERING', 'Đang giao': 'RECEIVED' };
	const handleCancelOrder = async () => {
		let confirm = window.confirm('Bạn có chắc muốn hủy đơn hàng này không?');
		if (confirm) {
			await orderCancel(record.orderID, loginStore.login.employeeID);
			setRecordRow((pre) => ({ ...pre, orderStatus: 'Đã hủy' }));
			setIsRowHidden(true);
			return Functions.showToast('success', `Đã hủy đơn hàng #${record.orderID}!`);
		}
	};
	const handleProcessOrder = async () => {
		let status;
		if (recordRow.orderStatus === 'Chờ duyệt') status = 'Đang giao';
		else if (recordRow.orderStatus === 'Đang giao') status = 'Đã giao';
		let confirm = window.confirm('Bạn có chắc muốn chuyển trang thái đơn hàng này không?');
		if (confirm) {
			await orderStatusUpdate(
				record.orderID,
				processOrderStatus[recordRow.orderStatus],
				loginStore.login.employeeID
			);
			setRecordRow((pre) => ({ ...pre, orderStatus: status }));
			setIsRowHidden(true);
			return Functions.showToast('success', `Đơn hàng #${record.orderID} ${status} !`);
		}
	};

	useEffect(
		() => {
			if (recordRow.orderStatus === 'Đã giao' || recordRow.orderStatus === 'Đã hủy') setIsHidden(true);
		},
		[ recordRow ]
	);
	return (
		<RecordContextProvider value={recordRow}>
			<TableRow className={cx({ 'display-hidden': isRowHidden }, 'hover:cursor-pointe ')}>
				{React.Children.map(children, (field) => {
					return <TableCell key={`${id}-${field.props.source}`}>{field}</TableCell>;
				})}
				<TableCell padding="none">
					<Button
						onClick={() => {
							setOpen(true);
						}}
						color="success"
						className={cx('text-colorPrimary ')}
						variant="outlined"
						startIcon={<DescriptionOutlinedIcon />}
					>
						Xem chi tiết
					</Button>
				</TableCell>
				<TableCell className="hidden" padding="none">
					<Button
						className={cx({ 'display-hidden': isHidden })}
						onClick={handleProcessOrder}
						variant="outlined"
						startIcon={<LocalShippingOutlinedIcon />}
					>
						Duyệt
					</Button>
				</TableCell>
				<TableCell padding="none">
					<Button
						onClick={handleCancelOrder}
						className={cx({ 'display-hidden': isHidden }, 'text-red-600')}
						color="error"
						variant="outlined"
						startIcon={<DeleteIcon />}
					>
						Hủy
					</Button>
				</TableCell>
			</TableRow>
			<React.Fragment>
				<Dialog
					open={open}
					onClose={() => {
						setOpen(false);
					}}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">{`Chi tiết đơn hàng #${recordRow.orderID}`}</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							<Typography>
								<h4 className={cx('font-medium text-xl mx-5')}>Danh sách sản phẩm đã mua</h4>

								{recordRow.orderDetails.map((detail) => {
									return (
										<div className={cx('container px-5')}>
											<div className={cx('content')}>
												<img
													src={detail.product.thumbnail}
													alt="thumbnail"
													width={30}
													height={30}
												/>
												<p className="text-xl font-semibold text-colorPrimaryLight ">
													Sản phẩm: {detail.product.name}
												</p>
												<p className="text-xl text-black">
													Số lượng mua: {detail.quantity} (sp)
												</p>
												<p className="text-xl text-black">
													Giá mua: {Functions.toVND(detail.priceOrder)}
												</p>
												<hr />
											</div>
										</div>
									);
								})}
								<div className={cx('px-5 my-2')}>
									<p className={cx('text-2xl font-medium text-black ')}>
										Tổng tiền hàng: {Functions.toVND(Functions.getPriceOrderTotal(recordRow))}
									</p>
									<p className={cx('text-2xl font-medium text-red-500 ')}>
										Voucher Giảm: -{recordRow.orderVouchers.length > 0 ? (
											Functions.toVND(Functions.getTotalDiscountVoucher(recordRow.orderVouchers))
										) : (
											Functions.toVND(0)
										)}
									</p>
									<p className={cx('text-2xl font-medium text-colorPrimary ')}>
										Tổng thanh toán:{' '}
										{Functions.toVND(
											Functions.getPriceOrderTotal(recordRow) -
												Functions.getTotalDiscountVoucher(recordRow.orderVouchers)
										)}
									</p>
									{recordRow.isPay && <p className={cx('text-xl font-medium ')}>( Đã thanh toán )</p>}
								</div>
							</Typography>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => {
								setOpen(false);
							}}
							autoFocus
						>
							Oke
						</Button>
					</DialogActions>
				</Dialog>
			</React.Fragment>
		</RecordContextProvider>
	);
};
const MyDatagridBody = (props) => <DatagridBody {...props} row={<MyDatagridRow />} />;
const DatagridHeader = ({ children }) => (
	<TableHead>
		<TableRow>
			<TableCell>Mã đơn hàng </TableCell>
			<TableCell>Mã khách hàng </TableCell>
			<TableCell>Tên khách hàng </TableCell>
			<TableCell>Số điện thoại </TableCell>
			<TableCell>Địa chỉ</TableCell>
			{/* <TableCell>Mã nhân viên</TableCell> */}
			<TableCell>Ngày tạo </TableCell>
			<TableCell>Trạng thái </TableCell>
			<TableCell> Hành động </TableCell>
		</TableRow>
	</TableHead>
);
const MyDatagrid = (props) => (
	<Datagrid {...props} rowClick="expand" expand={<OrderDetailShow />} body={<MyDatagridBody />} />
);
const postFilters = [
	<SelectInput
		label="Trạng thái đơn hàng"
		source="orderStatus"
		emptyText="Đã hủy"
		emptyValue="CANCELED"
		choices={[
			{ id: 'PENDING', name: 'Chờ duyệt' },
			{ id: 'DELIVERING', name: 'Đang giao' },
			{ id: 'RECEIVED', name: 'Đã giao' }
		]}
		alwaysOn
	/>,
	// <DateInput label="Ngày tạo" source="dateCreate" alwaysOn />,
	<SearchInput placeholder="Tìm kiếm đơn hàng" source="searchText" alwaysOn />
];
const PostPagination = () => <Pagination rowsPerPageOptions={[ 5, 10, 15, 20, 30 ]} />;
const Empty = () => (
	<Box textAlign="center" m={1}>
		<Typography variant="h4" paragraph>
			Không có đơn hàng nào!
		</Typography>
	</Box>
);
const OrderList = (props) => {
	return (
		<List {...props} filters={postFilters} pagination={<PostPagination />}>
			<h1>
				<span className="text-[rgb(107 107 107)] font-medium my-4 mx-2  text-xl cursor-pointer ">
					Danh sách đơn hàng
				</span>{' '}
			</h1>
			<MyDatagrid expand={<OrderDetailShow />} header={<DatagridHeader />} empty={<Empty />}>
				<TextField label="OrderID" source="orderID" />
				<TextField label="CustomerID" source="customerID" />
				<TextField label="Name" source="fullName" />
				<NumberField source="phoneNumber" />
				<TextField source="shippingAddress" />
				{/* <TextField label="EmployeeID" source="employeeID" /> */}
				<DateField showTime={true} label="Date" source="dateCreate" />
				{/* <FunctionField
					label="voucher"
					render={(record) => {
						if (record.voucherID) return `-${Functions.toVND(record.discountVoucher)}`;
						else Functions.toVND(0);
					}}
				/> */}
				{/* <ReferenceField label="voucher" source="voucherID" reference="voucher">
					<TextField source="title" />
				</ReferenceField> */}
				{/* <FunctionField
					label="orderDetails"
					render={(record) => {
						let total = record.orderDetails.reduce((total, record) => {
							total += record.quantity * record.priceOrder;
							return total;
						}, 0);
						if (!record.voucherID) {
							return Functions.toVND(total);
						} else return Functions.toVND(total - record.discountVoucher);
					}}
				/> */}
				<TextField label="orderStatus" source="orderStatus" />
			</MyDatagrid>
		</List>
	);
};

const OrderDetailShow = () => {
	return <div>test </div>;
};

export { OrderList };
