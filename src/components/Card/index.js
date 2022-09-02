import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from './Card.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { Functions } from '~/utils/Function';
import { Rating, Skeleton } from '@mui/material';
const blinkSaleImage = require('~/assets/images/blink-sale.gif');
const cx = classNames.bind(styles);

const ProductCard = ({ product, smallSize }) => {
	return (
		<div className={cx('wrapper')}>
			<div className={cx('container')}>
				<div
					title={product.name}
					className={cx('h-auto  bg-white drop-shadow-md hover:drop-shadow-xl p-5', {
						'min-w-[244px] min-h-[169px] overflow-hidden ': smallSize
					})}
				>
					<Link to={`/product/${product.productID}`}>
						{Functions.checkDiscount(product) && (
							<img src={blinkSaleImage} width="50" height="50" className="absolute top-0 left-0" />
						)}
						<img
							src={product.thumbnail}
							className={cx('object-cover w-[206px] h-[294px]', { 'w-[100px] h-[100px] ': smallSize })}
						/>
						<h3>{Functions.cropText(product.name)}</h3>
						<div className="flex flex-row">
							<span>{Functions.toVND(Functions.getPriceOrder(product))}</span>
							{Functions.checkDiscount(product) && (
								<p className="ml-1">
									<span className="line-through mr-1">{Functions.toVND(product.price)}</span>
									<span className="text-white bg-red-500 rounded-md w-auto h-auto p-1">
										-{product.discountPercent * 100}%
									</span>
								</p>
							)}
						</div>
						<button className="px-4 py-1 text-sm  font-semibold rounded-full border border-purple-200 text-white bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 hover:bg-slate-500 ">
							Xem
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

const Loading = () => {
	return (
		<div className={cx('wrapper')}>
			<div className={cx('container')}>
				<div className="h-auto  bg-white drop-shadow-md hover:drop-shadow-xl p-5">
					<Skeleton variant="rectangular" width={206} height={294} />
					<Skeleton variant="text" sx={{ fontSize: '2rem' }} />
					<Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
					<Skeleton variant="rounded" className="rounded-xl " width={40} height={20} />
				</div>
			</div>
		</div>
	);
};

ProductCard.Loading = Loading;
export default ProductCard;
