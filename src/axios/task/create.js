import axios from 'axios';
import config from '../../utils/config';

const baseURL = config.heroku_url || config.localhost_url;

const createTask = (body, headers, cb) => {
	axios.post(baseURL + '/officer/tasks/create', body, {
		headers
	}).then(r => {
		cb(r.data, null);
	}).catch(err => {
		cb(null, err.response.data);
	});
};

export default createTask;
