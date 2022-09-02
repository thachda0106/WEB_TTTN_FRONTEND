module.exports = {
	content: [ './pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}' ],
	theme: {
		extend: {
			fontFamily: {
				sans: [ 'robot', 'sans-serif' ]
			},
			colors: {
				colorPrimary: '#008848',
				colorPrimaryLight: '#1d8a53',
				colorPrimaryDark: '#037841',
				colorTextPrimary: '#6f9972',
				colorGrayBackground: '#eee',
				colorPrimaryTextBackground: '#def1e9',
				colorYellow: '#f5f101',
				colorOrange: '##fcf2e7',
				colorTextOrange: '#fdb454',
				colorGrayText: '#999',
				colorGreen: '#4b90cc',
				colorLightBlack: '#333',
				colorDarkGray: '#999',
				colorGray: '#bbb',
				colorLightGray: '#ddd',
				colorPrimaryButton: '#e3ebe7',
				colorRed: 'red',
				colorBlueViolet: '#8A2BE2',
				colorInfo: '#218DF2',
				colorStar: '#F2A221',
				colorGreen: '#007aff',
				colorBgGray: '#e9edf0',
				colorBgTransparent: '#f0f8ff94'
			},
			opacity: {
				1: '0.005'
			}
		}
	},
	plugins: []
};
