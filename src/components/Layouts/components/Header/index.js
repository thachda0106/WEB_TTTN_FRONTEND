import React from 'react';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
const Header = () => {
	return (
		<header className={cx('wrapper')}>
			<div className={cx('inner')}>
				{/* LOGO */}
				<div className={cx('logo')}>
					<img src={images.logo} alt="tiktok logo" />
				</div>

				{/* SEARCH */}
				<div className={cx('search')}>
					<input placeholder="Tìm kiếm tài khoản và video" spellCheck={false} />
					<button className={cx('clear')}>
						<FontAwesomeIcon icon={faCircleXmark} />
					</button>
					<FontAwesomeIcon icon={faSpinner} className={cx('loading')} />

					{/* Loading */}
					<button className={cx('search-btn')}>
						<FontAwesomeIcon icon={faMagnifyingGlass} />
					</button>
				</div>

				{/* ACTIONS */}
				<div className={cx('actions')}>actions</div>
				<div />
			</div>
		</header>
	);
};

export default Header;
