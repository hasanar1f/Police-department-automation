import axios from 'axios';
import config from '../../utils/config';

const baseURL = config.heroku_url || config.localhost_url;

const searchCase = (params, headers, cb) => {
	axios.get(baseURL + '/officer/case/search', {
		params,
		headers
	}).then(r => {
		cb(r.data, null);
	}).catch(err => {
		cb([], {
			error: err.message
		});
	});
};

export default searchCase;
