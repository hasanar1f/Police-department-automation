import axios from 'axios';
import config from '../../utils/config';

const baseURL = config.heroku_url || config.localhost_url;

const upload = async (path, formdata, headers, params, cb) => {
	return axios.post(baseURL + path, formdata, {
		params,
		headers
	}).then(r => {
		if (r.data.images) {
			cb(r.data.images, null);
		} else if (r.data.image) {
			cb(r.data.image, null);
		} else if (r.data.documents) {
			cb(r.data.documents, null);
		} else if (r.data.document) {
			cb(r.data.document, null);
		}
	}).catch(error => {
		console.log(error);
	});


};

export default upload;
