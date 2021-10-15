import axios from 'axios';
import config from '../../utils/config';

const baseURL = config.heroku_url || config.localhost_url;

const gdCountPerDivision = async (params, headers, cb) => {
	return axios.get(baseURL + '/officer/visualize/gd/perDivision', {
		params,
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

export default gdCountPerDivision;
