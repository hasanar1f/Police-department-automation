import axios from 'axios';
import config from '../../utils/config';

const baseURL = config.heroku_url || config.localhost_url;

const assignOfficers = (params, body, headers, cb) => {
	return axios.post(baseURL + '/officer/case/assign', body, {
		params,
		headers
	}).then(r => {
		if (cb) {
			cb(r.data, null);
		}
	}).catch(err => {
		if (cb) {
			cb(null, {
				message: err.response.data.error,
				errorCode: err.response.status
			});
		}
	});
};

export default assignOfficers;
