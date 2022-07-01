import React from 'react';
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
const SideBar = () => {
	return <aside className={cx('wrapper')}>SideBar</aside>;
};

export default SideBar;
