import axios from 'axios';
import config from '../../utils/config';

const baseURL = config.heroku_url || config.localhost_url;

const updateTask = (body, params, headers, cb) => {
	axios.patch(baseURL + '/officer/tasks/update', body, {
		params,
		headers
	}).then(r => {
		cb(r.data, null);
	}).catch(err => {
		cb(null, err.response.data);
	});
};

export default updateTask;
