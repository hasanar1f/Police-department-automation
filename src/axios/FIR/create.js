import axios from 'axios';
import config from '../../utils/config';

const baseURL = config.heroku_url || config.localhost_url;

const createFIR = (body, headers, cb) => {
	axios.post(baseURL + '/officer/fir/create', body, {
		headers
	}).then(r => {
		if (cb) {
			cb(r, null);
		}
	}).catch(error => {
		console.log(error);
	});
};

export default createFIR;
