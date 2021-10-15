import React from 'react';
import './styles.css';
import { Link } from 'react-router-dom';

const Error = (props) => {

	let message = props.location.message;
	let code = props.location.status;

	return (
		<div className='root'>
			<h1 className='h1'>
				{code}
			</h1>
			<h3 className='h3'>
				{message}
			</h3>
			<Link
				to={{
					pathname: '/home',
					authenticated: true,
					loggedIn: false
				}}
			>
				<button className='button'>
					
					হোমে ফিরে যান
				</button>
			</Link>
		</div>
	);
};

export default Error;
