import React, {Component} from 'react'
import Match from './Match'
import MatchNavigator from './MatchNavigator'
import { Switch, Route, Link } from 'react-router-dom'
import './semantic-ui-css/semantic.min.css';
import {Header, Table,Button, Rating,Loader,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'




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

