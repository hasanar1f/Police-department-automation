import axios from 'axios';
import config from '../../utils/config';

const baseURL = config.heroku_url || config.localhost_url;

const createPresidentAppealVerdict = async (body, headers, cb) => {
	return axios.post(baseURL + '/officer/presidentAppeal/verdict/create', body, {
		headers
	}).then(r => {
		if (cb) {
			cb(r.data, null);
		}
	}).catch(error => {
		if (cb) {
			cb(null, error.data);
		}
	});
};

export default createPresidentAppealVerdict;
