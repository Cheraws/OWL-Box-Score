import React, {Component} from 'react'
import Match from './Match'
import { Switch, Route, Link } from 'react-router-dom'
import './semantic-ui-css/semantic.min.css';
import {Header, Table,Button, Rating,Loader,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'

import * as firebase from "firebase";
import {databaseRef} from "./config/firebase.js"


class MatchNavigator extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }
  componentDidMount() {
    var that = this;

    firebase.auth().onAuthStateChanged(function(user) {
      databaseRef.ref("stages/1/match_info").once("value").then(function(snapshot){
        let val = snapshot.val()
        that.setState({ data: val ,canary: "hi"})
      })
    })
  }

  render(){
    let matches = []
    let count = 0
    /**
    if(this.state.canary == "hi"){
      for(let match of this.state.data){
        console.log(match)
        let match_button = <Dropdown.Item>
          <a href={'#/match/' + count}  activeClassName="active">
            <div>{match.home}</div>
            <div>VS {match.away}</div>
          </a>
        </Dropdown.Item>
        matches.push(match_button)
        count += 1
      }
    }
    **/
    let menu = (
      <div className= "App-header">
        <Menu fixed="top" >
          <Menu.Item
            as='a'
            href='/'
            name='OWL Scores'
          />

        </Menu>
      </div>
    )
    return(
      <div>
        {menu}
      </div>
    );
  }  
}

export default MatchNavigator
