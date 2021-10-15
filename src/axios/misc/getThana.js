import axios from 'axios';
import config from '../../utils/config';

const baseURL = config.heroku_url || config.localhost_url;

const getThana = async (body, cb) => {
	return axios.post(baseURL + '/thana/get', body, {}).then(res => {
		if (cb) {
			cb(res.data, null);
		}
	}).catch(err => {
		if (cb) {
			cb(null, err.data);
		}
	});
};

export default getThana;
