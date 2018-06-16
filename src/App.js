import React, {Component} from 'react'
import Match from './Match'
import MatchNavigator from './MatchNavigator'
import { Switch, Route, Link } from 'react-router-dom'
import './semantic-ui-css/semantic.min.css';
import {Header, Table,Button, Rating,Loader,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'




let menu = (
  <div className= "App-header">
    <Menu fixed="top" inverted>
      <Menu.Item>OWL Stats</Menu.Item>
      <Menu.Item>
        <Dropdown text = "Matches">
          <Dropdown.Menu>
              <Link to={'/matches/36'} activeClassName="active">Link</Link>
            <Dropdown.Item>Link </Dropdown.Item>
          </Dropdown.Menu>
      </Dropdown>
      </Menu.Item>
    </Menu>
  </div>
)

class App extends Component {
  
  render(){
    return(
      <div>
        <MatchNavigator />
        <Match />
      </div>
    );
  }  
}
export default App

