import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import InputGD from '../GD/create/InputGD';
import ViewGD from '../GD/view/GDview';
import Login from '../login/Login';
import InputCase from '../CaseEntry/create/InputCase';
import Welcome from '../Home/Welcome';
import SelectGD from '../GD/option/Select';
import SelectCase from '../CaseEntry/option/Select';
import CaseRecords from '../CaseEntry/search/CaseRecords';
import CaseView from '../CaseEntry/view/caseView';
import TaskCreator from '../Task/create/TaskCreator';
import TaskRecords from '../Task/viewTask/TaskRecords';
import TaskView from '../Task/view/TaskView';
import InputChargeSheet from '../ChargeSheet/create/InputChargeSheet';
import Error from '../utilViews/error';
import IRInput from '../InvestigationReport/Create/IRInput';
import IRInput_gd from '../InvestigationReport_GD/Create/IRInput';
import InputHearing from '../Forms/InputHearing';
import InputVerdict from '../Forms/InputVerdict';
import ChargesheetView from '../ChargeSheet/view/ChargesheetView';
import InvestigationView from '../InvestigationReport/view/InvestigationView';
import InvestigationView_gd from '../InvestigationReport_GD/view/InvestigationView';
import GDRecords from '../GD/search/GDRecords';
import InputAppeal from '../Forms/InputAppeal';
import InputAppealVerdict from '../Forms/InputAppealVerdict';
import InputPresidentAppeal from '../Forms/InputPresidentAppeal';
import InputPresidentVerdict from '../Forms/InputPresidentVerdict';
import InputCourt from '../Forms/InputCourt';
import InputResolve from '../Forms/InputResolve';
import ViewAppeal from '../appeal/ViewAppeal';
import ViewPresidentAppeal from '../appeal/ViewPresidentAppeal';
import ViewAppealVerdict from '../appeal/ViewAppealVerdict';
import ViewPresidentAppealVerdict from '../appeal/ViewPresidentAppealVerdict';
import ViewHearing from '../hearing/ViewHearing';
import ViewResolve from '../resolve/ViewResolve';
import ViewVerdict from '../appeal/ViewVerdict';
import ViewCourt from '../appeal/ViewCourt';
import Visualize from '../visualize/Visualize';
import VisualizeSelect from '../visualize/Select';
import BdMap from '../visualize/Map';
import DivisionViz from '../visualize/DivisionViz';
import DistrictViz from '../visualize/DistrictViz';
import ThanaViz from '../visualize/ThanaViz';

const RouterComponent = () => {
	const [authenticated, setAuthenticated] = useState(false);

	return (
		<div>
			<Switch>
				<Route
					exact
					path="/login"
					render={() => <Login setAuth={setAuthenticated} />}
				/>
				<Route
					exact
					path={['/', '/home']}
					render={props => <Welcome {...props} />}
				/>
				<Route
					exact
					path="/gd/option"
					render={props => <SelectGD {...props} />}
				/>
				<Route
					exact
					path="/gd/records"
					render={props => <GDRecords {...props} />}
				/>
				<Route exact path="/gd/create" render={() => <InputGD />} />
				<Route
					exact
					path="/gd/view"
					render={props => <ViewGD {...props} />}
				/>
				<Route
					exact
					path="/chargeSheet/create"
					render={() => <InputChargeSheet />}
				/>
				<Route
					exact
					path="/chargeSheet/view"
					render={props => <ChargesheetView {...props} />}
				/>
				<Route
					exact
					path="/investigationReport/Create"
					render={() => <IRInput />}
				/>
				<Route
					exact
					path="/investigationReport_gd/Create"
					render={() => <IRInput_gd />}
				/>
				<Route
					exact
					path="/investigationReport/view"
					render={props => <InvestigationView {...props} />}
				/>
				<Route
					exact
					path="/investigationReport_gd/view"
					render={props => <InvestigationView_gd {...props} />}
				/>
				<Route
					exact
					path="/hearing/create"
					render={() => <InputHearing />}
				/>
				<Route
					exact
					path="/verdict/create"
					render={() => <InputVerdict />}
				/>
				<Route
					exact
					path="/appeal/view"
					render={props => <ViewAppeal {...props} />}
				/>
				<Route
					exact
					path="/presidentAppeal/view"
					render={props => <ViewPresidentAppeal {...props} />}
				/>
				<Route
					exact
					path="/presidentVerdict/view"
					render={props => <ViewPresidentAppealVerdict {...props} />}
				/>
				<Route
					exact
					path="/appealVerdict/view"
					render={props => <ViewAppealVerdict {...props} />}
				/>
				<Route
					exact
					path="/verdict/view"
					render={props => <ViewVerdict {...props} />}
				/>
				<Route
					exact
					path="/hearing/view"
					render={props => <ViewHearing {...props} />}
				/>
				<Route
					exact
					path="/resolve/view"
					render={props => <ViewResolve {...props} />}
				/>
				<Route exact path="/appeal/create" render={() => <InputAppeal />} />
				<Route
					exact
					path="/appealVerdict/create"
					render={() => <InputAppealVerdict />}
				/>
				<Route
					exact
					path="/presidentAppeal/create"
					render={() => <InputPresidentAppeal />}
				/>
				<Route
					exact
					path="/presidentVerdict/create"
					render={() => <InputPresidentVerdict />}
				/>
				<Route
					exact
					path="/resolve/create"
					render={() => <InputResolve />}
				/>
				<Route
					exact
					path="/caseEntry/create"
					render={() => <InputCase />}
				/>
				<Route exact path="/court/create" render={() => <InputCourt />} />
				<Route
					exact
					path="/caseEntry/view"
					render={props => <CaseView {...props} />}
				/>
				<Route
					exact
					path="/court/view"
					render={props => <ViewCourt {...props} />}
				/>
				<Route
					exact
					path="/caseEntry/records"
					render={props => <CaseRecords {...props} />}
				/>
				<Route
					exact
					path="/caseEntry/option"
					render={props => <SelectCase {...props} />}
				/>

				<Route
					exact
					path="/visualize/AllTime"
					render={() => <Visualize />}
				/>
				<Route exact path="/visualize/map" render={() => <BdMap />} />
				<Route
					exact
					path="/visualize/division"
					render={() => <DivisionViz />}
				/>

				<Route
					exact
					path="/visualize/district"
					render={() => <DistrictViz />}
				/>

				<Route exact path="/visualize/thana" render={() => <ThanaViz />} />
				<Route
					exact
					path="/visualize/Select"
					render={() => <VisualizeSelect />}
				/>
				<Route exact path="/task/create" render={() => <TaskCreator />} />
				<Route exact path="/task/records" render={() => <TaskRecords />} />
				<Route
					exact
					path="/task/view"
					render={props => <TaskView {...props} />}
				/>
				<Route exact path="/error" render={props => <Error {...props} />} />
			</Switch>
		</div>
	);
};

export default RouterComponent;
