import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import MenuIcon from '@mui/icons-material/Menu';
import {
	Backdrop,
	Breadcrumbs,
	Button,
	Checkbox,
	CircularProgress,
	FormControlLabel,
	OutlinedInput
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { actions } from '~/state/slices/loginSlice';
const cx = classNames.bind(styles);
const SideBar = () => {
	const appStore = useSelector((state) => state.app);
	const loginStore = useSelector((state) => state.login);
	const dispatch = useDispatch();
	const [ expanded, setExpanded ] = React.useState(false);
	const [ categoryFilter, setCategoryFilter ] = useState(() => {
		if (loginStore.filter && loginStore.filter.categoryFilter) return loginStore.filter.categoryFilter;
		return appStore.categories.reduce((list, category) => {
			return { ...list, [category.categoryID]: true };
		}, {});
	});
	const [ filterAdvanced, setFilterAdvanced ] = useState(() => {
		if (loginStore.filter && loginStore.filter.filterAdvanced) {
			return loginStore.filter.filterAdvanced;
		} else
			return {
				asc: true,
				desc: true,
				discountBest: true,
				minPrice: 0,
				maxPrice: 0
			};
	});

	const [ filterPrice, setFilterPrice ] = useState({
		minPrice: 0,
		maxPrice: 0
	});

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	useEffect(
		() => {
			let action = actions.setFilterProductHome({ filterAdvanced, categoryFilter });
			dispatch(action);
		},
		[ filterAdvanced, categoryFilter ]
	);

	useEffect(
		() => {
			if (loginStore.filter) {
				setFilterAdvanced(loginStore.filter.filterAdvanced);
				setCategoryFilter(loginStore.filter.categoryFilter);
			}
		},
		[ loginStore.filter ]
	);
	return (
		<aside className={cx('wrapperr min-w-[220px] ')}>
			<Breadcrumbs className={cx('breadcrumb text-2xl font-medium ')} aria-label="breadcrumb">
				<Link underline="hover" color="inherit" to="/">
					Home
				</Link>
				<p underline="hover" color="price.primary" aria-current="page">
					Products
				</p>
			</Breadcrumbs>
			<div className={cx('container ')}>
				<Accordion expanded={expanded} onChange={handleChange('panel1')}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1bh-content"
						id="panel1bh-header"
					>
						<Typography variant="h5" component="p">
							Danh mục sản phẩm
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography>
							{appStore.categories.map((category) => {
								return (
									<Typography key={category.categoryID} variant="h6" component="p">
										<Checkbox
											onClick={(e) => {
												setCategoryFilter((pre) => {
													return { ...pre, [category.categoryID]: !e.target.checked };
												});
											}}
											checked={!categoryFilter[category.categoryID]}
										/>
										{category.name}
									</Typography>
								);
							})}
						</Typography>
					</AccordionDetails>
				</Accordion>
				<Accordion expanded={true} onChange={handleChange('panel1')}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls="panel1bh-content"
						id="panel1bh-header"
					>
						<Typography variant="h5" component="p">
							Bộ lọc
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography>
							<Typography variant="h6" component="p">
								<Checkbox
									onClick={(e) => {
										setFilterAdvanced((pre) => {
											return {
												...pre,
												asc: true,
												desc: true,
												discountBest: !e.target.checked
											};
										});
									}}
									checked={!filterAdvanced.discountBest}
								/>
								Khuyến mãi tốt nhất
							</Typography>
						</Typography>
						<Typography>
							<Typography variant="h6" component="p">
								<Checkbox
									onClick={(e) => {
										setFilterAdvanced((pre) => {
											return {
												...pre,
												asc: true,
												discountBest: true,
												desc: !e.target.checked
											};
										});
									}}
									checked={!filterAdvanced.desc}
								/>
								Giá Giảm dần
							</Typography>
						</Typography>
						<Typography>
							<Typography variant="h6" component="p">
								<Checkbox
									onClick={(e) => {
										setFilterAdvanced((pre) => {
											return {
												...pre,
												desc: true,
												discountBest: true,
												asc: !e.target.checked
											};
										});
									}}
									checked={!filterAdvanced.asc}
								/>
								Giá tăng dần
							</Typography>
						</Typography>
						<Typography>
							<Typography variant="h6" component="p">
								Giá min
							</Typography>
							<OutlinedInput
								value={filterPrice.minPrice}
								onChange={(e) => {
									if (!Number.isInteger(+e.nativeEvent.data)) return;
									setFilterPrice((pre) => {
										return { ...pre, minPrice: +e.target.value };
									});
								}}
								size="small"
								className="w-48  "
								placeholder="Giá nhỏ nhất"
							/>
						</Typography>
						<Typography className="my-2">
							<Typography variant="h6" component="p">
								Giá max
							</Typography>
							<OutlinedInput
								value={filterPrice.maxPrice}
								onChange={(e) => {
									if (!Number.isInteger(+e.nativeEvent.data)) return;
									setFilterPrice((pre) => {
										return { ...pre, maxPrice: +e.target.value };
									});
								}}
								size="small"
								className="w-48  "
								placeholder="Giá lớn nhất"
							/>
						</Typography>
						<div className="my-2">
							<Button
								onClick={() => {
									setFilterAdvanced((pre) => ({ ...pre, ...filterPrice }));
								}}
								variant="outlined"
							>
								Lọc
							</Button>
						</div>
					</AccordionDetails>
				</Accordion>
			</div>
		</aside>
	);
};

export default SideBar;
