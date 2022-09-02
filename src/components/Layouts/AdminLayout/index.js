import React from 'react';
import { Layout } from 'react-admin';
import classNames from 'classnames/bind';
import styles from './AdminLayout.module.scss';
import Header from '~/components/Layouts/components/Header';
import Footer from '~/components/Layouts/components/Footer';
const cx = classNames.bind(styles);

/*
import { Layout } from 'react-admin';
import MyAppBar from './MyAppBar';
import MyMenu from './MyMenu';
import MyNotification from './MyNotification';

const MyLayout = (props) => <Layout {...props} appBar={MyAppBar} menu={MyMenu} notification={MyNotification} />;
*/
const AdminLayout = (props) => {
	console.log({ props });
	return <Layout {...props} appBar={Header} container={React.Fragment} />;
};
export default AdminLayout;
