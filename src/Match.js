import React from 'react'
import { Switch, Route } from 'react-router-dom'
import MatchInfo from './MatchInfo'

// The Roster component matches one of two different routes
// depending on the full pathname
const Match = () => (
  <Switch>
    <Route path='/match/:number' component={MatchInfo}/>
    <Route exact path='/' component={MatchInfo}/>
  </Switch>
)


export default Match
