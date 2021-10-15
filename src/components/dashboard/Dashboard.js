import React from 'react';
import { Link } from 'react-router-dom';


class Dashboard extends React.Component {

	state = {
		click: ''
	};

	render() {

		return (
			<div>

				<Link to='/' className='item'>Home</Link>
				<Link className='item'>Cases</Link>
				<Link className='item'>Helpline</Link>
				<Link className='item'>Emergency</Link>
				<Link to='GD/input' className='item'>GD</Link>

				<div className='right menu'>
					<Link className='item'>Logout</Link>
				</div>

			</div>
		);
	}
}

export default Dashboard;
