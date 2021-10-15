import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Drawer from './drawer/Drawer';
import RouterComponent from './router';


class App extends React.Component {
	render() {
		return (
			<div id='main'>
			
					<BrowserRouter>
						<Drawer />
						<RouterComponent />
					</BrowserRouter>
			
			</div>
		);
                
	}
}

export default App;
