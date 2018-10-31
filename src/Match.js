import React from 'react'
import { Switch, Route } from 'react-router-dom'
import MatchInfo from './MatchInfo'
import Navigator from './Navigator'

import PlayerProfile from './PlayerProfile'

// The Roster component matches one of two different routes
// depending on the full pathname
const Match = () => (
  <Switch>
    <Route path='/match/:stage/:number' component={MatchInfo}/>
    <Route exact path='/' component={Navigator}/>
    <Route exact path='/navigator/:stage' component={Navigator}/>

    <Route exact path='/player/:player' component={PlayerProfile}/>
  </Switch>
)


export default Match
