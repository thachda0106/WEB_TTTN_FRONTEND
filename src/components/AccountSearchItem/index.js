import React from 'react';
import styles from './AccountSearchItem.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
const AccountSearchItem = () => {
	return (
		<div className={cx('wrapper')}>
			{/* AVATAR */}
			<img
				className={cx('avatar')}
				src={
					'https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/46410bbc9ae178384ab7973ae93c0c4b~c5_300x300.webp?x-expires=1657458000&x-signature=fwdHcGK9YNnJVpYOxMFwV%2FZ7PWQ%3D'
				}
				alt="avatar"
			/>
			{/* INFO USER */}
			<div className={cx('info')}>
				<h4 className={cx('name')}>
					<span>Nguyen van A</span>
					<FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
				</h4>
				<span className={cx('username')}>Nda 12</span>
			</div>
		</div>
	);
};

export default AccountSearchItem;
