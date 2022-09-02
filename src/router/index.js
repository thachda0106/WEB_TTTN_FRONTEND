import Home from '~/pages/Home';
import Signin from '~/pages/Author/Signin';
import Signup from '~/pages/Author/Signup';
import ForgotPassword from '~/pages/Author/FogotPassword';
import Profile from '~/pages/Author/profile';
import EmployeeProfile from '~/pages/Author/EmployeeProfile';
import ProductDetail from '~/pages/Product/ProductDetail';
import AdminManager from '~/pages/AdminManager';
import HeaderOnly from '~/components/Layouts/HeaderOnly';
import DefaultLayout from '~/components/Layouts/DefaultLayout';
import NotFound from '~/pages/NotFound';
import Cart from '~/pages/Cart';
import Voucher from '~/pages/Voucher';
import MyVoucher from '~/pages/MyVoucher';
import MyOrder from '~/pages/MyOrder';
import Order from '~/pages/Order';
import ProductHome from '~/pages/Product/ProductHome';
// public routers
// layout_non_property => DefaultLayout, null=> Fragment, layout=> layout
const publicRouters = [
	{ path: '/', component: Home, layout: HeaderOnly },
	{ path: '/sign-in', component: Signin, layout: HeaderOnly },
	{ path: '/sign-up', component: Signup, layout: HeaderOnly },
	{ path: '/forgot-password', component: ForgotPassword, layout: HeaderOnly },
	{ path: '/profile', component: Profile, layout: HeaderOnly },
	{ path: '/employee-profile', component: EmployeeProfile, layout: HeaderOnly },
	{ path: '/product/:productID', component: ProductDetail, layout: HeaderOnly },
	{ path: '/cart', component: Cart, layout: HeaderOnly },
	{ path: '/voucher', component: Voucher, layout: HeaderOnly },
	{ path: '/my-voucher', component: MyVoucher, layout: HeaderOnly },
	{ path: '/order', component: Order, layout: HeaderOnly },
	{ path: '/my-order', component: MyOrder, layout: HeaderOnly },
	{ path: '/products', component: ProductHome, layout: DefaultLayout },
	{ path: '*', component: NotFound, layout: HeaderOnly }
];
const privateRouters = [ { path: '/admin-manager/*', component: AdminManager } ];

export { publicRouters, privateRouters };
