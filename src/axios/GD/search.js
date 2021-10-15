import axios from 'axios';
import config from '../../utils/config';

const baseURL = config.heroku_url || config.localhost_url;

const searchGD = (params, headers, cb) => {
	return axios.get(baseURL + '/officer/gd/search', {
		params,
		headers
	}).then(r => {
		cb(r.data, null);
	}).catch(err => {
		cb(null, {
			error: 'something went wrong'
		});
	});
};

export default searchGD;
