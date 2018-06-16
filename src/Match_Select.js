import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Match from './Match'

// The Roster component matches one of two different routes
// depending on the full pathname
const Roster = () => (
  <Switch>

    <Route path='/match/' component={Match}/>
    <Route path='/match/:number' component={Match}/>
  </Switch>
)


export default Roster
