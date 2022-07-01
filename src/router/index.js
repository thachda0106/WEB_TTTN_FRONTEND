import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Upload from '~/pages/Upload';
import { HeaderOnly } from '~/components/Layouts';
// public routers
// layout_non_property => DefaultLayout, null=> Fragment, layout=> layout
const publicRouters = [
	{ path: '/', component: Home },
	{ path: '/following', component: Following },
	{ path: '/upload', component: Upload, layout: HeaderOnly }
];
const privateRouters = [];

export { publicRouters, privateRouters };
