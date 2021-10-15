import axios from 'axios';
import config from '../../utils/config';

const baseURL = config.heroku_url || config.localhost_url;

const searchTask = (params, headers, cb) => {
	axios.get(baseURL + '/officer/tasks/search', {
		params,
		headers
	}).then(r => {
		cb(r.data, null);
	}).catch(err => {
		cb(null, err.response);
	});
};

export default searchTask;
