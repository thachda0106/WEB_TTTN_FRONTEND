import simpleRestProvider from 'ra-data-simple-rest';
const servicesHost = 'http://localhost:8111/api/v1';
const dataProvider = simpleRestProvider(servicesHost);
const myDataProvider = {
	...dataProvider,
	create: async (resource, params) => {
		if (resource === 'product') {
			// fallback to the default implementation
			console.log({ data: params });
			if (params.data.thumbnail) {
				params.data.thumbnail = {
					base64: await convertFileToBase64(params.data.thumbnail),
					path: params.data.thumbnail.rawFile.path
				};
			}
			if (params.data.images) {
				for (let i = 0; i < params.data.images.length; i++) {
					params.data.images[i] = {
						base64: await convertFileToBase64(params.data.images[i]),
						path: params.data.images[i].rawFile.path
					};
				}
			}

			return dataProvider.create(resource, params);
		}
		return dataProvider.create(resource, params);
	},
	update: async (resource, params) => {
		if (resource === 'product') {
			// fallback to the default implementation
			if (params.data.newThumbnail) {
				params.data.newThumbnail = {
					base64: await convertFileToBase64(params.data.newThumbnail),
					path: params.data.newThumbnail.rawFile.path
				};
			}
			if (params.data.newImages) {
				for (let i = 0; i < params.data.newImages.length; i++) {
					params.data.newImages[i] = {
						base64: await convertFileToBase64(params.data.newImages[i].imageURL),
						path: params.data.newImages[i].imageURL.rawFile.path
					};
				}
			}

			return dataProvider.update(resource, params);
		}
		return dataProvider.update(resource, params);
	}
};

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;

		reader.readAsDataURL(file.rawFile);
	});

export default myDataProvider;
