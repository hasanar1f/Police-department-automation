import config from '../../utils/config';
import axios from 'axios';


const baseURL = config.heroku_url || config.localhost_url;

const login = (body, headers, cb) => {
	axios.post(baseURL + '/officer/login', body, {
		headers
	}).then(r => {
		cb(r.data, null);
	}).catch(err => {
		cb(null, err.response.data);
	});
};

export default login;
