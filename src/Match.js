import React from 'react'
import { Switch, Route } from 'react-router-dom'
import MatchInfo from './MatchInfo'
import Navigator from './Navigator'

// The Roster component matches one of two different routes
// depending on the full pathname
const Match = () => (
  <Switch>
    <Route path='/match/:stage/:number' component={MatchInfo}/>
    <Route exact path='/' component={Navigator}/>
    <Route exact path='/navigator/:stage' component={Navigator}/>
  </Switch>
)


export default Match
