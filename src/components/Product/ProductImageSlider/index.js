import React, { useState } from 'react';
import styles from './ProductImageSlider.module.scss';
import classNames from 'classnames/bind';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
const cx = classNames.bind(styles);
console.log(styles);
const ProductImageSlider = ({ images }) => {
	const [ thumbsSwiper, setThumbsSwiper ] = useState();
	console.log(thumbsSwiper);
	console.log(images);
	return (
		<div className={cx('wrapper')}>
			<button className="swiper-button-next" />
			<button className="swiper-button-prev" />

			<Swiper
				style={{
					'--swiper-navigation-color': '#fff',
					'--swiper-pagination-color': '#fff'
				}}
				loop={true}
				spaceBetween={10}
				navigation={{
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev'
				}}
				thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
				modules={[ Pagination, Navigation, Thumbs, FreeMode ]}
				grabCursor={true}
				pagination={{
					clickable: true
				}}
				className={cx('product-images-slider')}
			>
				{images.map((item) => {
					return (
						<div>
							<SwiperSlide key={item.id} className={cx('swiper-slider')}>
								<img
									src={item.imageURL}
									alt="product-image"
									style={{ height: '250px', width: ' 250px', objectFit: 'cover' }}
								/>
							</SwiperSlide>
						</div>
					);
				})}
			</Swiper>
			<Swiper
				onSwiper={setThumbsSwiper}
				loop={true}
				spaceBetween={5}
				slidesPerView={4}
				freeMode={true}
				watchSlidesProgress={true}
				modules={[ FreeMode, Navigation, Thumbs ]}
				className={cx('swiper-slider-thumbs')}
			>
				{images.map((item) => {
					return (
						<div>
							<SwiperSlide key={item.id} className={cx('swiper-slide-thumbs')}>
								<img
									// onClick={(e) => setThumbsSwiper(e.target.src)}
									src={item.imageURL}
									alt="product-image"
									style={{
										height: '50px',
										width: ' 50px',
										objectFit: 'cover',
										border: '1px solid #00ff188a'
									}}
									className={cx('swiper-img-thumbs')}
								/>
							</SwiperSlide>
						</div>
					);
				})}
			</Swiper>
		</div>
	);
};

export default ProductImageSlider;
