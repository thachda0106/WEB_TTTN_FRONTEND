import React, { useState, useEffect, useMemo } from 'react';
import styles from './Cart.module.scss';
import classNames from 'classnames/bind';
import { Breadcrumbs, Button } from '@mui/material';
import { Link,useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Functions } from '~/utils/Function';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { increaseCartItem, decreaseCartItem, deleteAllCartItem, deleteCartItem } from '~/apiServices/cartServices';
import { actions } from '~/state/slices/loginSlice';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import VoucherApplyItem from '~/components/VoucherApplyItem';
import { findProductByID } from '~/apiServices/productServices';
const cx = classNames.bind(styles);

const Cart = () => {
	const loginStore = useSelector((state) => state.login);
	const appStore = useSelector((state) => state.app);
	const dispatch = useDispatch();
	const navigate = useNavigate()
	const [ open, setOpen ] = React.useState(false);
	const [ scroll, setScroll ] = React.useState('paper');
	const [ vouchersApply, setVouchersApply ] = useState([]);
	const handleInitialApplyVouchers = () => {
		if(!loginStore.login.vouchers) return []
		let vouchers = loginStore.login.vouchers.filter((voucher) => {
			if (voucher.isUsed) return false;
			let now = new Date().getTime();
			let dateStart = new Date(voucher.dateStart).getTime();
			// let dateEnd = new Date(voucher.dateEnd).getTime();
			if(now < dateStart) return false
			return loginStore.login.cartItems.some((item) => {
				return item.product.productID === voucher.productID;
			});
		});
		for (let i = 0; i < vouchers.length; i++) {
			let product = appStore.products.find((product) => product.productID === vouchers[i].productID);
			if (!product) {
				let rest = findProductByID(vouchers[i].productID);
				product = rest.data;
			}
			let newAttribute = {
				thumbnail: product.thumbnail,
				nameProduct: product.name,
				productPrice: product.price,
				isApply: false
			};

			vouchers[i] = { ...vouchers[i], ...newAttribute };
		}
		return vouchers;
	};
	const handleClickOpen = (scrollType) => () => {
		setOpen(true);
		setScroll(scrollType);
	};
	const handleClose = () => {
		setOpen(false);
	};
	const handleDelete = async (itemID) => {
		let confirm = window.confirm('Bạn có chắc muốn xóa sản phẩm này?')
		if(!confirm) return;
		let rest = await deleteCartItem(itemID);
		if (rest.status != 204) return Functions.showToast('error', 'Lỗi xóa sản phẩm!');
		let action = actions.deleteCartItem({ itemID });
		dispatch(action);
	};
	const handleDeleteAll = async () => {
		let confirm = window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm này?')
		if(!confirm) return;
		let cartID = loginStore.login.cartID;
		let rest = await deleteAllCartItem(cartID);
		if (rest.status != 204) return Functions.showToast('error', 'Lỗi xóa sản phẩm!');
		let action = actions.deleteAllCartItem({ cartID });
		dispatch(action);
	};
	const handleChangeQuantity = async ({ type, itemID, quantity, productID }) => {
		let product = appStore.products.find((product) => product.productID === productID);
		// (if(cartItem.))
		if (type === 'add') {
			if (product.quantity === quantity) {
				return Functions.showToast('warning', 'Số lượng sản phẩm đã tới giới hạn!');
			}
			let rest = await increaseCartItem(itemID);
			if (rest.status !== 201) return Functions.showToast('error', 'Lỗi tăng số lượng xóa sản phẩm!');
			let action = actions.inCreaseQuantityCartItem({ itemID });
			dispatch(action);
		}
		if (type === 'remove') {
			if (quantity == 1) {
				return Functions.showToast('warning', 'Số lượng sản phẩm đã nhỏ nhất!');
			}
			let rest = await decreaseCartItem(itemID);
			if (rest.status !== 201) return Functions.showToast('error', 'Lỗi giảm số lượng xóa sản phẩm!');
			let action = actions.deCreaseQuantityCartItem({ itemID });
			dispatch(action);
		}
	};
	const handleApplyVoucher = (voucherID, isApply,voucher) => {
		if(isApply === true){
			let item = loginStore.login.cartItems.find(item => item.product.productID === voucher.productID)
			let quantityVoucherProductUsed = vouchersApply.reduce((quantity, voucher) => {
				if(voucher.productID ===  item.product.productID && voucher.isApply === true) quantity+=1
				return quantity;
			}, 0)
			if(item.quantity === quantityVoucherProductUsed){
				return Functions.showToast('warning','Bạn đã dùng tối đa số lượng voucher có thể sử dụng cho sản phẩm này!')
			}

		}
		setVouchersApply((preVouchers) => {
			for (let i = 0; i < preVouchers.length; i++) {
				if (preVouchers[i].voucherID === voucherID) {
					preVouchers[i].isApply = isApply;
					continue;
				}
			}
			return [ ...preVouchers ];
		});
	};
	const totalDiscount = useMemo(
		() => {
			if (vouchersApply.length === 0) return 0;
			let total = vouchersApply.reduce((total, voucher) => {
				if (voucher.isApply) {
					let discount =
						voucher.discountPercent * voucher.productPrice > voucher.maxDiscountValue
							? voucher.maxDiscountValue
							: voucher.discountPercent * voucher.productPrice;
					total += discount;
				}
				return total;
			}, 0);
			return total;
		},
		[ vouchersApply ]
	);
	const priceOrderTotal = useMemo(
		() => {
			if(!loginStore.isLogin  ) return 0;
			if(!loginStore.login.cartItems ) return 0;
			if( loginStore.login.cartItems.length === 0) return 0;
			return Functions.getPriceOrderTotalNoVoucher(loginStore.login.cartItems) - totalDiscount;
		},
		[ loginStore.login.cartItems, totalDiscount ]
	);

	useEffect(
		() => {
			let vouchers = handleInitialApplyVouchers();
			setVouchersApply(vouchers);
		},
		[ loginStore.login.cartItems?.length ]
	);
	let handleOrderContinue = async () => {
		let cartID = loginStore.login.cartID,
			customerID = loginStore.login.customerID,
			vouchersIDApply = vouchersApply.reduce((vouchersID ,voucher) => {
				if (voucher.isApply === true){
				     vouchersID = [...vouchersID, voucher.voucherID]
				} return vouchersID
			}, [])
			
		let orderAddInfo = {cartID,customerID,vouchersIDApply};
		let cartItems = [...loginStore.login.cartItems]
		for(let i = 0; i < cartItems.length; i++) {
			let priceOrder = await Functions.getPriceOrder(cartItems[i].product) 
			cartItems[i] = {... cartItems[i],product: {...cartItems[i].product, priceOrder: priceOrder} }
		}	
		let orderWrap = {orderAddInfo, cartItems: [...cartItems], totalDiscount, priceOrderTotal }
		let action = actions.setOrderWrap(orderWrap);
		dispatch(action);
		navigate('/order')
	};
	if (!loginStore.login.cartItems) return <div />;
	if (!vouchersApply) return <div />;
	return (
		<div className={cx('wrapper', 'w-full')}>
			<div className={cx('container', 'w-full')}>
				{/* BREADCRUMS */}
				<Breadcrumbs className={cx('breadcrumb')} aria-label="breadcrumb">
					<Link underline="hover" color="inherit" to="/">
						Home
					</Link>
					<p underline="hover" color="text.primary" aria-current="page">
						Cart
					</p>
				</Breadcrumbs>
				{/* cart list Items */}
				{loginStore.login.cartItems.length === 0 ? (
					<h3 className={'font-medium my-2 ml-2'}>
						{' '}
						<ShoppingCartIcon /> Danh sách sản phẩm trống!{' '}
					</h3>
				) : (
					<React.Fragment>
						<h3 className={'font-medium my-2 ml-2'}>
							{' '}
							<ShoppingCartIcon /> Danh sách sản phẩm{' '}
							<span onClick={handleDeleteAll} className="text-colorGreen text-lg cursor-pointer ">
								( Xóa tất cả)
							</span>
						</h3>
						<div className={cx('content', 'flex-row-start', 'gap-4')}>
							<div className={cx('list-cartItem', 'max-w-[800px]')}>
								<TableContainer style={{ boxShadow: '0px 0px 10px 2px #ddd' }} component={Paper}>
									<Table sx={{ minWidth: 650 }} size="medium" aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell style={{ fontSize: '12px' }}>Sản phẩm</TableCell>
												<TableCell style={{ fontSize: '12px' }} align="left">
													Giá gốc{' '}
												</TableCell>
												<TableCell style={{ fontSize: '12px' }} align="left">
													Giảm{' '}
												</TableCell>
												<TableCell style={{ fontSize: '12px' }} align="right">
													Số lượng
												</TableCell>
												<TableCell style={{ fontSize: '12px' }} align="left">
													Thành tiền
												</TableCell>
												<TableCell style={{ fontSize: '12px' }} align="center">
													{' '}
													Action{' '}
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{loginStore.login.cartItems.map((row) => (
												<TableRow
													className="cursor-pointer "
													hover={true}
													key={row.itemID}
													sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
												>
													<TableCell style={{ fontSize: '12px' }} align="left">
														<Link to={`/product/${row.product.productID}`}>
															{row.product.name}{' '}
															<img
																alt="img"
																src={row.product.thumbnail}
																width="50"
																height="50"
																className="object-cover "
															/>{' '}
														</Link>
													</TableCell>
													<TableCell style={{ fontSize: '12px' }} align="left">
														{Functions.toVND(row.product.price)}
													</TableCell>
													<TableCell style={{ fontSize: '12px' }} align="left">
														{Functions.toVND(
															Functions.checkDiscount(row.product)
																? row.product.discountPercent * row.product.price
																: 0
														)}
													</TableCell>
													{/* <TableCell style={{fontSize: '12px'}} align="left">{Functions.toVND( Functions.getPriceOrder(row.product) ) }</TableCell> */}
													<TableCell
														style={{ fontSize: '12px' }}
														align="right"
														component="th"
														scope="row"
														className="flex items-center justify-center "
													>
														<div style={{ border: '1px solid #ddd', display: 'flex' }}>
															<button
																onClick={() =>
																	handleChangeQuantity({
																		type: 'remove',
																		itemID: row.itemID,
																		quantity: row.quantity,
																		productID: row.product.productID
																	})}
																style={{
																	fontSize: '15px',
																	padding: '2px'
																}}
															>
																<RemoveOutlinedIcon />
															</button>
															<input
																disabled
																value={row.quantity}
																style={{
																	width: '50px',
																	// outline: '1px solid #ddd',
																	textAlign: 'end',
																	fontSize: '16px'
																}}
																type="number"
															/>
															<button
																onClick={() =>
																	handleChangeQuantity({
																		type: 'add',
																		itemID: row.itemID,
																		quantity: row.quantity,
																		productID: row.product.productID
																	})}
																style={{
																	fontSize: '15px',
																	padding: '2px 3px'
																}}
															>
																<AddOutlinedIcon />
															</button>
														</div>
													</TableCell>
													<TableCell style={{ fontSize: '12px' }} align="left">
														{Functions.toVND(
															Functions.getPriceOrder(row.product) * row.quantity
														)}
													</TableCell>
													<TableCell style={{ fontSize: '12px' }} align="left">
														{' '}
														<Button
															onClick={() => handleDelete(row.itemID)}
															size="small"
															variant="outlined"
															startIcon={<DeleteIcon />}
														>
															Delete
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</div>
							<div
								className={cx('order-info', 'flex-1', 'rounded-md p-4')}
								style={{ boxShadow: '0px 0px 10px 2px #ddd', alignSelf: 'flex-start' }}
							>
								<div className={(cx('coupon '), 'flex justify-between items-baseline px-2 py-2 ')}>
									<p className="font-bold min-w-[90px] h-5">Khuyến mãi </p>
									<span
										onClick={() => setOpen(true)}
										className="text-colorGreen cursor-pointer hover:underline text-lg "
									>
										{' '}
										<LocalOfferOutlinedIcon /> Chọn khuyến mãi
									</span>
									<Dialog
										open={open}
										onClose={handleClose}
										scroll={scroll}
										aria-labelledby="scroll-dialog-title"
										aria-describedby="scroll-dialog-description"
									>
										<DialogTitle id="scroll-dialog-title">Khuyến mãi có thể áp dụng! </DialogTitle>
										<DialogContent dividers={scroll === 'paper'}>
											<DialogContentText id="scroll-dialog-description" tabIndex={-1}>
												{vouchersApply.length === 0 ? 'Không có voucher nào!' : ''}
												{vouchersApply.map((voucher) => {
													return (
														<VoucherApplyItem
															key={voucher.voucherID}
															handleApplyVoucher={handleApplyVoucher}
															voucher={voucher}
														/>
													);
												})}
											</DialogContentText>
										</DialogContent>
										<DialogActions>
											<Button onClick={handleClose}>Close</Button>
										</DialogActions>
									</Dialog>
								</div>
								<div className={'action'}>
									<h6 className="font-bold px-2 py-2">Thanh toán</h6>
									<p className="flex justify-between px-2 py-1 ">
										<span className="text-xl font-semibold ">Tổng tạm tính</span>
										<span className="text-xl font-semibold ">
											{Functions.toVND(
												Functions.getPriceOrderTotalNoVoucher(loginStore.login.cartItems)
											)}
										</span>
									</p>
									<p className="flex justify-between px-2 py-1 ">
										<span className="text-xl font-semibold ">Khuyễn mãi</span>
										<span className="text-xl font-semibold text-red-600 ">
											- {Functions.toVND(totalDiscount)}
										</span>
									</p>
									<p className="flex justify-between px-2 py-1 ">
										<span className="text-xl font-semibold ">Thành tiền</span>
										<span className="text-xl font-semibold text-colorPrimary ">
											{Functions.toVND(priceOrderTotal)}
										</span>
									</p>
								</div>
								<div className="flex justify-end">
									<Button
										onClick={handleOrderContinue}
										style={{ backgroundColor: 'rgb(0 122 255)' }}
										className={'rounded self-end '}
									>
										<span className={cx('text-black font-bold rounded min-w-[80px] p-1 text-lg  ')}>
											Tiếp tục
										</span>
									</Button>
								</div>
							</div>
						</div>
					</React.Fragment>
				)}
			</div>
		</div>
	);
};

export default Cart;
