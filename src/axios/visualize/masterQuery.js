import axios from 'axios';
import config from '../../utils/config';

const baseURL = config.heroku_url || config.localhost_url;

const masterQuery = async (headers, cb) => {
	return axios.get(baseURL + '/officer/visualize/masterQuery', {
		headers
	}).then(r => {
		if (cb) {
			cb(r.data, null);
		}
	}).catch(error => {
		if (cb) {
			cb(null, {
				message: error.response.data.error,
				errorCode: error.response.status
			});
		}
	});
};

export default masterQuery;
