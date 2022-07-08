import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css'; //
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import { WrapperPopper } from '~/components/Popper';
import images from '~/assets/images';
import styles from './Header.module.scss';
import AccountSearchItem from '~/components/AccountSearchItem';

const cx = classNames.bind(styles);
const Header = () => {
	const [ searchResult, setSearchResult ] = useState([]);
	useEffect(() => {
		setTimeout(() => {
			setSearchResult([ 'ket qua' ]);
		}, 3000);
	});
	return (
		<header className={cx('wrapper')}>
			<div className={cx('inner')}>
				{/* LOGO */}
				<div className={cx('logo')}>
					<img src={images.logo} alt="tiktok logo" />
				</div>

				{/* SEARCH */}
				<Tippy
					visible={searchResult.length > 0}
					interactive={true}
					render={(attrs) => (
						<div className={cx('search-result')} tabIndex="-1" {...attrs}>
							<WrapperPopper>
								<h4 className={cx('search-title')}>Tài khoản</h4>
								<AccountSearchItem />
								<AccountSearchItem />

								<AccountSearchItem />

								<AccountSearchItem />
							</WrapperPopper>
						</div>
					)}
				>
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
				</Tippy>

				{/* ACTIONS */}
				<div className={cx('actions')}>actions</div>
				<div />
			</div>
		</header>
	);
};

export default Header;
