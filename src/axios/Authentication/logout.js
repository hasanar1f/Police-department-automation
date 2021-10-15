import config from '../../utils/config';
import axios from 'axios';

const baseURL = config.heroku_url || config.localhost_url;

const logout = (headers, cb) => {
	axios.post(baseURL + '/officer/logout', {}, {
		headers
	}).then(r => {
		cb(r.data, null);
	}).catch(err => {
		cb(null, err.response.data);
	});
};

export default logout;
