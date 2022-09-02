import React, { useState, useEffect } from 'react';
import styles from './OrderItem.module.scss';
import classNames from 'classnames/bind';
import { Functions } from '~/utils/Function';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, OutlinedInput, Rating } from '@mui/material';
import { orderCancel } from '~/apiServices/orderServices';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { addRatingProduct } from '~/apiServices/productServices';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

const OrderItem = ({ order }) => {
	const loginStore = useSelector((state) => state.login);
	const [ orderShow, setOrderShow ] = useState({ ...order });
	const [ open, setOpen ] = React.useState(false);
	const [ productRatingID, setProductRatingID ] = React.useState();
	const [ rating, setRating ] = useState({ starNumber: 5, content: '' });
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setRating({ starNumber: 5, content: '' });
		setOpen(false);
	};
	const handleRating = async () => {
		if (rating.content.trim().length === 0) return Functions.showToast('error', 'Vui lòng nhập nội dung đánh giá!');
		let rest = await addRatingProduct({
			customerID: loginStore.login.customerID,
			orderID: order.orderID,
			productID: productRatingID,
			...rating
		});
		if (rest.status !== 201) return Functions.showToast('error', 'Lỗi đánh giá sản phẩm!');
		else {
			setOrderShow((pre) => {
				let index = pre.orderDetails.findIndex((detail) => detail.productID === productRatingID);
				pre.orderDetails[index].isRated = true;
				return pre;
			});
			Functions.showToast('success', `Đánh giá sản phẩm #${productRatingID} thành công!`);
			handleClose();
		}
	};
	useEffect(
		() => {
			if (orderShow.orderStatus !== order.orderStatus) {
				setOrderShow({ ...order });
			}
		},
		[ order ]
	);
	return (
		<Accordion className={cx('px-5 my-4')}>
			<AccordionSummary
				className={cx('min-w-[1125px]')}
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1a-content"
				id="panel1a-header"
			>
				<div className={cx('container px-5 pt-4  flex justify-between ')}>
					<div className={cx('content')}>
						<div className={cx('flex items-center text-center ')}>
							<p className={cx('text-2xl font-medium ')}>Mã đơn hàng #{orderShow.orderID}</p>
							<span className={cx('text-xl font-medium ml-4 ')}>
								{Functions.timestampToDateTime(new Date(orderShow.dateCreate).getTime())}
							</span>
						</div>
						<p className={cx('text-2xl font-medium ')}>
							Trạng thái: <span className={cx('text-colorPrimary mx-2')}>{orderShow.orderStatus} </span>
						</p>
						<p className={cx('text-2xl font-medium ')}>
							Tổng tiền hàng:
							<span className={cx('text-black mx-2')}>
								{Functions.toVND(Functions.getPriceOrderTotal(orderShow))}{' '}
							</span>
						</p>
						<p className={cx('text-2xl font-medium ')}>
							Voucher giảm:
							<span className={cx('text-red-500 mx-2')}>
								-{order.orderVouchers.length > 0 ? (
									Functions.toVND(Functions.getTotalDiscountVoucher(order.orderVouchers))
								) : (
									Functions.toVND(0)
								)}
							</span>
						</p>
						<p className={cx('text-2xl font-medium ')}>
							Tổng thanh toán:
							<span className={cx('text-colorPrimary mx-2')}>
								{Functions.toVND(
									Functions.getPriceOrderTotal(orderShow) -
										Functions.getTotalDiscountVoucher(order.orderVouchers)
								)}
							</span>
						</p>
					</div>
					{orderShow.orderStatus === 'Chờ duyệt' && (
						<Button
							className="self-start"
							onClick={() => {
								let confirm = window.confirm('Bạn có chắc muốn hủy đơn hàng này!');
								if (confirm) {
									orderCancel(orderShow.orderID);
									setOrderShow((pre) => ({ ...pre, orderStatus: 'Đã hủy' }));
									Functions.showToast('success', `Đã hủy đơn hàng #${orderShow.orderID} thành công!`);
								}
							}}
							size="small"
							variant="outlined"
							startIcon={<DeleteIcon />}
						>
							Hủy đơn
						</Button>
					)}
				</div>
			</AccordionSummary>
			<AccordionDetails>
				<Typography>
					<h4 className={cx('font-medium text-xl mx-5')}>Danh sách sản phẩm đã mua</h4>

					{orderShow.orderDetails.map((detail) => {
						return (
							<div className={cx('container px-5')}>
								<div className={cx('content')}>
									<Link to={`/product/${detail.product.productID}`}>
										<img src={detail.product.thumbnail} alt="thumbnail" width={30} height={30} />
									</Link>
									<p className="text-xl font-semibold text-colorPrimaryLight ">
										Sản phẩm: {detail.product.name}
										{orderShow.orderStatus === 'Đã giao' && (
											<React.Fragment>
												{!detail.isRated && (
													<Button
														onClick={() => {
															console.log({ detail });
															handleClickOpen();
															setProductRatingID(detail.productID);
														}}
														className="text-lg font-medium text-colorPrimaryLight "
													>
														(Đánh giá sản phẩm <StarsOutlinedIcon />)
													</Button>
												)}
												<Dialog
													open={open}
													onClose={handleClose}
													aria-labelledby="alert-dialog-title"
													aria-describedby="alert-dialog-description"
												>
													<DialogTitle id="alert-dialog-title">
														{`Đánh giá sản phẩm #${productRatingID} `}
													</DialogTitle>
													<DialogContent>
														<DialogContentText id="alert-dialog-description">
															<Rating
																name="simple-controlled"
																value={rating.starNumber}
																defaultValue={5}
																onChange={(event, newValue) => {
																	setRating((pre) => ({
																		...pre,
																		starNumber: newValue
																	}));
																}}
															/>
															<div>
																<OutlinedInput
																	value={rating.content}
																	onChange={(e) => {
																		setRating((pre) => ({
																			...pre,
																			content: e.target.value
																		}));
																	}}
																	multiline={true}
																	placeholder="Nhập đánh giá "
																/>
															</div>
														</DialogContentText>
													</DialogContent>
													<DialogActions>
														<Button
															onClick={() => {
																handleRating();
															}}
															autoFocus
														>
															Đồng ý
														</Button>
														<Button onClick={handleClose}>Hủy</Button>
													</DialogActions>
												</Dialog>
											</React.Fragment>
										)}
									</p>
									<p className="text-xl text-black">Số lượng mua: {detail.quantity} (sp)</p>
									<p className="text-xl text-black">Giá mua: {Functions.toVND(detail.priceOrder)}</p>
									<hr />
								</div>
							</div>
						);
					})}
					<div className={cx('px-5')}>
						{order.isPay && <p className={cx('text-xl font-medium ')}>( Đã thanh toán )</p>}
					</div>
				</Typography>
			</AccordionDetails>
		</Accordion>
	);
};

export default OrderItem;
