import React from 'react';
import {
  Route,
  Switch,
  // Redirect
} from 'react-router-dom'

import MainApp from './MainApp'
import FundPage from '../pages/FundPage'



export default function Routes(props) {
  return (
   <Switch>
     <Route exact path="/" render={(props) => <MainApp {...props} />} />
     <Route path="/fund/:id" render={(props) => <FundPage {...props} />} />
    </Switch>
  );
}
