import React from 'react';
import {
  Route,
  Switch,
  // Redirect
} from 'react-router-dom'

import MainApp from './MainApp'


export default function Routes(props) {
  return (
   <Switch>
     <Route exact path="/" render={(props) => <MainApp {...props} />} />
    </Switch>
  );
}
