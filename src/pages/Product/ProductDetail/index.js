import React, { useRef, useEffect, useState } from 'react';
import styles from './ProductDetail.module.scss';
import classNames from 'classnames/bind';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Functions } from '~/utils/Function';
import { addCartItem } from '~/apiServices/cartServices';
import { findProductByID } from '~/apiServices/productServices';
import { Avatar, Backdrop, Box, Button, CircularProgress, Pagination, Rating, Stack, Tab, Tabs } from '@mui/material';
import ProductImageSlider from '~/components/Product/ProductImageSlider';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { actions } from '~/state/slices/loginSlice';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import Comment from '~/components/Comment';
import { addCommentProduct } from '~/apiServices/productServices';
const cx = classNames.bind(styles);
const ProductDetail = () => {
	let { productID } = useParams();
	const appStore = useSelector((state) => state.app);
	const loginStore = useSelector((state) => state.login);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [ product, setProduct ] = useState();
	const [ isPending, setIsPending ] = useState(false);
	const descriptionRef = useRef();
	const btnAddCart = useRef();
	const [ tab, setTab ] = useState('rating');
	//
	const [ open, setOpen ] = React.useState(false);
	const [ scroll, setScroll ] = React.useState('paper');
	const [ comment, setComment ] = useState('');
	const ratingRef = useRef();
	const commentRef = useRef();
	const handleClickOpen = (scrollType) => () => {
		setOpen(true);
		setScroll(scrollType);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const handleAddCart = async () => {
		if (!loginStore.isLogin) {
			localStorage.setItem('backLink', window.location.pathname);
			Functions.showToast('warning', 'Vui l??ng ????ng nh???p tr?????c khi mua h??ng!');
			return navigate('/sign-in');
		}
		const infoCart = { productID, cartID: loginStore.login.cartID, quantity: 1 };

		let check = false;
		loginStore.login.cartItems.forEach((item) => {
			if (item.product.productID == productID) {
				if (item.quantity >= product.quantity) {
					check = true;
					return Functions.showToast('warning', 'S??? l?????ng c???a s???n ph???m n??y trong gi??? h??ng ???? t???i gi???i h???n!');
				}
			}
		});
		if (check === true) return;
		//
		let rest = await addCartItem(infoCart);
		if (rest.status !== 201)
			return Functions.showToast('error', 'L???i th??m s???n ph???m v??o gi??? h??ng. Ki???m tra l???i ???????ng truy???n m???ng!');

		let cartItem = { ...rest.data, product };
		let action = actions.addCartItems(cartItem);
		dispatch(action);
		Functions.showToast('success', 'Th??m s???n ph???m th??nh c??ng!');
		// minus product.quantity of the page to show info product
		setProduct((product) => {
			return { ...product, quantity: product.quantity - 1 };
		});
	};
	const descriptionElementRef = React.useRef(null);
	const handleComment = async () => {
		if (!loginStore.isLogin) return Functions.showToast('warning', 'B???n h??y ????ng nh???p tr?????c khi b??nh lu???n!');
		if (comment.trim().length === 0) return Functions.showToast('warning', 'B???n ch??a nh???p n???i dung b??nh lu???n!');
		let rest = await addCommentProduct({ username: loginStore.login.username, productID, content: comment });
		if (rest.status !== 201) return Functions.showToast('error', 'L???i b??nh lu???n s???n ph???m!');
		setProduct((pre) => {
			pre.comments.unshift(rest.data);
			return { ...pre };
		});
		setComment('');
	};
	useEffect(
		() => {
			if (open) {
				const { current: descriptionElement } = descriptionElementRef;
				if (descriptionElement !== null) {
					descriptionElement.focus();
				}
			}
		},
		[ open ]
	);
	//
	useEffect(() => {
		const findProduct = async () => {
			let res = await findProductByID(productID);
			if (res.status !== 200) {
				Functions.showToast('warning', 'L???i ???????ng truy???n h??y ki???m tra m???ng!');
				navigate('/');
			} else {
				setProduct(res.data);
			}
			setIsPending(false);
		};

		setIsPending(true);
		findProduct();
	}, []);
	useEffect(
		() => {
			if (product) {
				descriptionRef.current.innerHTML = product.description;
			}
			if (loginStore.isLogin && product) {
				if (loginStore.login.role !== 'customer') {
					btnAddCart.current.disabled = true;
					btnAddCart.current.style.display = 'none';
				}
			}
		},
		[ isPending ]
	);
	useEffect(
		() => {
			if (product) {
				if (tab === 'rating') {
					ratingRef.current.style.display = 'block';
					commentRef.current.style.display = 'none';
				} else {
					ratingRef.current.style.display = 'none';
					commentRef.current.style.display = 'block';
				}
			}
		},
		[ tab ]
	);
	if (!product) return <div />;
	return (
		<div className={cx('wrapper')}>
			<div className={cx('container')}>
				<Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isPending}>
					<CircularProgress color="inherit" />
				</Backdrop>
				{/* BREADCRUMS */}
				<Breadcrumbs className={cx('breadcrumb')} aria-label="breadcrumb">
					<Link underline="hover" color="inherit" to="/">
						Home
					</Link>
					<Link underline="hover" color="inherit" to="/products">
						Products
					</Link>
					<p underline="hover" color="text.primary" aria-current="page">
						Product Detail
					</p>
				</Breadcrumbs>
				{/* PRODUCT INFO */}
				<div className={cx('product-info')}>
					<h1 className={cx('title')}>
						<ArrowCircleDownIcon /> Th??ng tin s???n ph???m
					</h1>
					<div className={cx('content')}>
						<div className={cx('primary', 'flex-row-start gap-5')}>
							<div className={cx('images')}>
								<ProductImageSlider images={product.images} />
							</div>
							<div className={cx('detail', 'self-start')}>
								<div className={cx('flex-row-start gap-2 ')}>
									<h3 className={cx('font-medium text-colorGreen ')}>{product.name}</h3>
									<Rating precision={0.5} name="read-only" value={product.starNumber} readOnly />
								</div>
								{/* <p className={cx('font-medium')}>Hi???n c??n: {productTotal} (sp)</p> */}
								<p className={cx('font-medium')}>M?? s???n ph???m: #{product.id} </p>
								<p className={cx('font-medium')}>Danh m???c: {product.categoryName} </p>
								<p className={cx('font-medium')}>Nh??n h??ng: {product.brand} </p>
								<p className={cx('font-medium')}>B???o h??nh: {product.guarantee} (th??ng)</p>
								<div className={cx('flex-row-start gap-2 ')}>
									<p className={cx('font-medium')}>
										Gi??: {Functions.toVND(Functions.getPriceOrder(product))}
									</p>
									{Functions.checkDiscount(product) && (
										<p className={cx('font-medium ml-1')}>
											<span className="line-through mr-1">{Functions.toVND(product.price)}</span>
											<span className="text-white bg-red-500 rounded-md w-auto h-auto p-1">
												-{product.discountPercent * 100}%
											</span>
										</p>
									)}
								</div>
								<div>
									<Button onClick={handleClickOpen('paper')}>Xem c???u h??nh s???n ph???m</Button>
									<Dialog
										open={open}
										onClose={handleClose}
										scroll={scroll}
										aria-labelledby="scroll-dialog-title"
										aria-describedby="scroll-dialog-description"
									>
										<DialogTitle id="scroll-dialog-title">Chi ti???t s???n ph???m </DialogTitle>
										<DialogContent dividers={scroll === 'paper'}>
											<DialogContentText
												id="scroll-dialog-description"
												ref={descriptionElementRef}
												tabIndex={-1}
											>
												{product.attributes.map((attribute) => {
													return (
														<div key={attribute.id} className={cx('font-medium text-xl')}>
															{`${attribute.name}: ${attribute.value}`}{' '}
														</div>
													);
												})}
											</DialogContentText>
										</DialogContent>
										<DialogActions>
											<Button onClick={handleClose}>Close</Button>
										</DialogActions>
									</Dialog>
								</div>
								{product.quantity == 0 ? (
									<Button
										style={{ backgroundColor: '#dddddd' }}
										ref={btnAddCart}
										variant="outlined"
										color="success"
									>
										H???t H??ng
									</Button>
								) : (
									<Button ref={btnAddCart} onClick={handleAddCart} variant="outlined" color="success">
										Th??m v??o gi??? H??ng
									</Button>
								)}
							</div>
						</div>
						<div>
							<h2 className={cx('font-medium text-lg-black ')}>
								{' '}
								<ArrowCircleDownIcon /> M?? t??? s???n ph???m
							</h2>
							<p ref={descriptionRef} className={cx('description p-5 pl-0')} />
						</div>
						<div className={cx('product-rating shadow-xl px-3 py-4 my-2 min-w-[1150px]  ')}>
							<Box sx={{ width: '100%' }}>
								<Tabs
									value={tab}
									onChange={(e, newValue) => {
										setTab(newValue);
									}}
									textColor="secondary"
									indicatorColor="secondary"
									aria-label="secondary tabs example"
								>
									<Tab value="rating" label="????nh gi?? v?? nh???n x??t" />
									<Tab value="comment" label="?????t c??u h???i cho s???n ph???m" />
								</Tabs>
							</Box>
							<div ref={ratingRef}>
								<h2 className="text-colorPrimaryLight font-semibold text-3xl ">
									<StarsOutlinedIcon />
									<StarsOutlinedIcon />
									<StarsOutlinedIcon />
									{`????nh gi?? s???n ph???m ${product.name}`}
								</h2>
								{/* <div className={cx('content-rating flex justify-start gap-2')}> */}
								<div className={cx('avgStar flex-row-start gap-1 ')}>
									<p>????nh gi?? trung b??nh: {product.starNumber}/5</p>
									<Rating
										precision={0.5}
										size="large"
										name="read-only"
										value={product.starNumber}
										readOnly
									/>
								</div>
								{product.rating.length === 0 && <div>Kh??ng c?? ????nh gi?? v?? nh???n x??t n??o!</div>}
								<div className={cx('content-rating')}>
									{product.rating.map((rating) => {
										return (
											<div key={rating.id} className={cx('my-2 p-4')}>
												<div className={cx('flex-row-start gap-4')}>
													<Avatar alt="avatar" src={rating.customerAvatar} />
													<span className="font-medium">{rating.customerName}</span>
												</div>
												<p>
													<Rating
														precision={0.5}
														size="small"
														name="read-only"
														value={rating.starNumber}
														readOnly
														className="mx-2"
													/>
													{rating.content}
												</p>
											</div>
										);
									})}
								</div>

								{/* <Stack spacing={2}>
									<Pagination
										onChange={(e) => {
											// setPage(+e.target.innerText);
										}}
										// count={Math.ceil(orders.length / maxRow)}
										count={1}
										color="primary"
									/>
								</Stack> */}
							</div>
							<div ref={commentRef} style={{ display: 'none' }}>
								<h2 className="text-colorPrimaryLight font-semibold text-3xl ">
									<StarsOutlinedIcon />
									<StarsOutlinedIcon />
									<StarsOutlinedIcon />
									{`H???i v?? ????p v??? s???n ph???m ${product.name}`}
								</h2>
								{product.comments.length === 0 && <div>Kh??ng c?? b??nh lu???n n??o!</div>}
								<textarea
									name=""
									id="f-comment-0"
									rows="4"
									placeholder="Vi???t c??u h???i c???a b???n"
									spellcheck="false"
									value={comment}
									onChange={(e) => setComment(e.target.value)}
								/>
								<Button onClick={handleComment}>G???i b??nh lu???n</Button>
								{product.comments.map((comment) => {
									return <Comment key={comment.commentID} comment={comment} />;
								})}
								{/* <Stack spacing={2}>
									<Pagination
										onChange={(e) => {
											// setPage(+e.target.innerText);
										}}
										// count={Math.ceil(orders.length / maxRow)}
										count={1}
										color="primary"
									/>
								</Stack> */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetail;
