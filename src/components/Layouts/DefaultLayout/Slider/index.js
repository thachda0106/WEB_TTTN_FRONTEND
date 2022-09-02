import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './style.css';
import { Pagination, Navigation } from 'swiper';
const banner1 = require('~/assets/images/banner1.webp');
const banner2 = require('~/assets/images/banner2.webp');

function Slider() {
	return (
		<div className="w-full h-auto relative">
			<button className="swiper-button-next" />
			<button className="swiper-button-prev" />
			<Swiper
				slidesPerView={1}
				spaceBetween={30}
				loop={true}
				pagination={{
					clickable: true
				}}
				navigation={{
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev'
				}}
				modules={[ Pagination, Navigation ]}
			>
				<SwiperSlide>
					<img src={banner1} alt="image" style={{ height: '100%', width: ' 100%', objectFit: 'cover' }} />
				</SwiperSlide>
				<SwiperSlide>
					<img src={banner2} alt="image" style={{ height: '100%', width: ' 100%', objectFit: 'cover' }} />
				</SwiperSlide>
			</Swiper>
		</div>
	);
}

export default Slider;
