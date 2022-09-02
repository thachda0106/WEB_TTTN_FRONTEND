import React, { useState, useEffect } from 'react';
import styles from './Header.module.scss';
import classNames from 'classnames/bind';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import DiscountIcon from '@mui/icons-material/Discount';
import MediationIcon from '@mui/icons-material/Mediation';
import { WrapperPopper } from '~/components/Popper';
import Tippy from '@tippyjs/react/headless';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { actions } from '~/state/slices/loginSlice';
import { Functions } from '~/utils/Function';
import { searchProducts as findProducts } from '~/apiServices/productServices';
import SearchItem from './SearchItem';
const cx = classNames.bind(styles);
const logo = require('~/assets/images/LOGO.png');
const Header = () => {
	const loginStore = useSelector((state) => state.login);
	const appStore = useSelector((state) => state.app);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [ openUserInfo, setOpenUserInfo ] = useState(false);
	const [ openCategories, setOpenCategories ] = useState(false);
	const [ searchProducts, setSearchProducts ] = useState([]);
	const [ searchText, setSearchText ] = useState('');
	const [ isPending, setIsPending ] = useState(false);
	const handleLogout = () => {
		dispatch(actions.logout());
		Functions.showToast('success', 'logout!');
		navigate("/sign-in")
		document.cookie = 'token=' + ';expires=Thu, 01 Jan 1970 00:00:01 GMT ;domain=localhost;path=/';
	};
	useEffect(
		() => {
			const handleSearch = async () => {
				// let product = await
				let text = searchText.trim().split(' ').filter(str => str.trim() !== '').join(' ')
				if (text === '') setSearchProducts([]);
				else {
					let products = await findProducts(text);
					setSearchProducts(products);
				}
			};
			setIsPending(true);
			const delayDebounceFn = setTimeout(() => {
				setIsPending(false);
				handleSearch(handleSearch);
			}, 1500);

			return () => clearTimeout(delayDebounceFn);
		},
		[ searchText ]
	);
	return (
		<div className={cx('wrapper',{'fixed':  !window.location.pathname.includes('/admin-manager')} , 'flex-row-center', 'drop-shadow-lg', {'mt-[-49px]': loginStore.login?.role != 'customer' && window.location.pathname.includes('/admin-manager')   })}>
			<div className={cx('container', 'flex-row-center')}>
				<div className={cx('logo', 'flex-row-center ')}>
					<Link to="/">
						<img src={logo} alt="logo" width={80} height={80} />
					</Link>
					<Tippy
						visible={openCategories}
						interactive={true}
						render={(attrs) => (
							<div
								className={cx('w-[248px] flex-row-center   ', 'userInfo', 'categories-wrapper-popper')}
								tabIndex="-1"
								{...attrs}
							>
								<WrapperPopper>
									{appStore.categories.map((category) => {
										return (
												
											<div onClick = {()=>{
												let filterAdvanced = {
												asc: true,
												desc: true,
												discountBest: true,
												minPrice: 0,
												maxPrice: 0
												};
												let categoryFilter = appStore.categories.reduce((list, category) => {
													return { ...list, [category.categoryID]: true };
												}, {});
												categoryFilter[category.categoryID] = false
												let action = actions.setFilterProductHome({filterAdvanced,categoryFilter})
												dispatch(action);
												navigate('/products')
												setOpenCategories(false)
											}} className={cx('item')}>

												<MediationIcon className={cx('icon-info')} />
												<span className={cx('text')}>{category.name}</span>
											</div>

										);
									})}
								</WrapperPopper>
							</div>
						)}
					>
						<div
							onClick={() => setOpenCategories(!openCategories)}
							className={cx('categories', 'flex-row-center')}
						>
							<MenuIcon className="icon" />
							<span>Danh mục sản phẩm</span>
						</div>
					</Tippy>
				</div>
				<div className={cx('search', 'flex-1', 'flex-row-center')}>
					<Tippy
						visible={searchText}
						interactive={true}
						render={(attrs) => (
							<div className={cx('min-w-[566px] ')} tabIndex="-1" {...attrs}>
								<WrapperPopper>
									{isPending && <div className={cx('p-5')}>loading...</div>}
									{!isPending &&
										searchProducts.length > 0 &&
										searchProducts.map((product) => {
											return <SearchItem onClick={()=>setSearchText('')} key={product.productID} product={product} />;
										})}
									{!isPending &&
									searchProducts.length === 0 && (
										<div className="p-4">Không tìm thấy sản phẩm nào!</div>
									)}
								</WrapperPopper>
							</div>
						)}
					>
						<input
							onChange={(e) => setSearchText(e.target.value)}
							type="text"
							placeholder="Nhập từ khóa cần tìm"
						/>
					</Tippy>
					<button>
						<SearchIcon className={cx('icon')} width="30px" height="30px" />
					</button>
				</div>
				{/* <div className={cx('user', 'flex-row-center')}>
								<AccountCircleOutlinedIcon className={cx('icon')} />
								<div className={cx('login')}>
									<div className={cx('text')}>Thu Thập</div>
									<div className={cx('text')}>Voucher</div>
								</div>
							</div> */}
				<div className={cx('action', 'flex flex-row ')}>
					{!loginStore.isLogin && (
						<div onClick= { ()=>{
							let backLink = window.location.pathname;
							localStorage.setItem('backLink', backLink);
							navigate('/sign-in')
						}}>
							<div className={cx('user', 'flex-row-center')}>
								<AccountCircleOutlinedIcon className={cx('icon')} />
								<div className={cx('login')}>
									<div className={cx('text')}>Đăng ký</div>
									<div className={cx('text')}>Đăng nhập</div>
								</div>
							</div>
						</div>
					)}
					{loginStore.isLogin && (
						<div
							onMouseOver={() => setOpenUserInfo(true)}
							onMouseLeave={() => setOpenUserInfo(false)}
							className={cx('wrapper', 'flex-row-center')}
						>
							<Tippy
								visible={openUserInfo}
								interactive={true}
								render={(attrs) => (
									<div
										className={cx('w-[248px] flex-row-center', 'userInfo')}
										tabIndex="-1"
										{...attrs}
									>
										<WrapperPopper>
											{loginStore.login.role === 'customer' && (
												<React.Fragment>
													<Link to="/profile">
														<div className={cx('item')}>
															<AccountCircleOutlinedIcon className={cx('icon-info')} />
															<span className={cx('text')}>Thông tin tài khoản</span>
														</div>
													</Link>
													<Link to="/my-order">
														<div className={cx('item')}>
															<ShoppingBagOutlinedIcon className={cx('icon-info')} />
															<span className={cx('text')}>Quản lý đơn hàng</span>
														</div>
													</Link>
													<Link to="/voucher">
														<div className={cx('item')}>
															<DiscountIcon className={cx('icon-info')} />
															<span className={cx('text')}>Thu thập voucher</span>
														</div>
													</Link>
													<Link to="/my-voucher">
														<div className={cx('item')}>
															<CardGiftcardOutlinedIcon className={cx('icon-info')} />
															<span className={cx('text')}>Voucher của của bạn</span>
														</div>
													</Link>
														<div className={cx('item', 'flex-row-center')}>
															<Button onClick={handleLogout} className={cx('button')}>
																<span className={cx('text-white font-bold ')}>
																	Đăng xuất
																</span>
															</Button>
														</div>
												</React.Fragment>
											)}
											{(loginStore.login.role === 'employee' ||
												loginStore.login.role === 'manager ') && (
												<React.Fragment>
													<Link to={'/employee-profile'}>
														<div className={cx('item')}>
															<AccountCircleOutlinedIcon className={cx('icon-info')} />
															<span className={cx('text')}>Thông tin tài khoản</span>
														</div>
													</Link>
													<Link to="/admin-manager">
														<div className={cx('item')}>
															<CardGiftcardOutlinedIcon className={cx('icon-info')} />
															<span className={cx('text')}>Danh mục quản lý</span>
														</div>
													</Link>
														<div className={cx('item', 'flex-row-center')}>
															<Button onClick={handleLogout} className={cx('button')}>
																<span className={cx('text-white font-bold ')}>
																	Đăng xuất
																</span>
															</Button>
														</div>
												</React.Fragment>
											)}
										</WrapperPopper>
									</div>
								)}
							>
								<div className={cx('user', 'flex-row-center')}>
									<Avatar alt={loginStore.login.username} src={loginStore.login.avatar} />
									<div className={cx('login')}>
										<div className={cx('text')}>Xin chào,</div>
										<div className={cx('text')}> {loginStore.login.fullName} </div>
									</div>
								</div>
							</Tippy>
						</div>
					)}

					<Link to={!loginStore.isLogin ? '/sign-in' : '/cart'}>
						{loginStore.isLogin &&
						loginStore.login.role === 'customer' && (
							<div className={cx('cart', 'flex-row-center')}>
								<ShoppingCartOutlinedIcon className={cx('icon')} />
								<div className={cx('info')}>
									<div className={cx('text')}>Giỏ hàng của bạn</div>
									<div className={cx('text')}>
										(<span className={cx('text-red-600 font-bold')}>
											{loginStore.login.cartItems?.reduce(
												(total, cartItem) => total + cartItem.quantity,
												0
											)}
										</span>) sản phẩm
									</div>
								</div>
							</div>
						)}
						{!loginStore.isLogin && (
							<div className={cx('cart', 'flex-row-center')}>
								<ShoppingCartOutlinedIcon className={cx('icon')} />
								<div className={cx('info')}>
									<div className={cx('text')}>Giỏ hàng của bạn</div>
									<div className={cx('text')}>
										(<span className={cx('text-red-600')}>Bạn chưa đăng nhập!</span>)
									</div>
								</div>
							</div>
						)}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Header;
