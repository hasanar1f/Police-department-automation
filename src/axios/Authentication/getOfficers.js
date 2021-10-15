import axios from 'axios';
import config from '../../utils/config';

const baseURL = config.heroku_url || config.localhost_url;

const getOfficers = (body, headers, cb) => {
	return axios.post(baseURL + '/officer/get/all', body, {
		headers
	}).then(r => {
		if (cb) {
			cb(r.data, null);
		}
	}).catch(err => {
		if (cb) {
			cb(null, err.response.data);
		}
	});
};

export default getOfficers;
