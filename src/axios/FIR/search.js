import axios from 'axios';
import config from '../../utils/config';


//const baseURL = config.localhost_url || config.heroku_url

const baseURL = config.heroku_url || config.localhost_url;


const searchFIR = (params, headers, cb) => {
	axios.get(baseURL + '/officer/fir/search', {
		params,
		headers
	}).then(r => {
		cb(r.data.firs, null);
	}).catch(err => {
		cb(null, {
			error: 'something went wrong'
		});
	});
};

export default searchFIR;
