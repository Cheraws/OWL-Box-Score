import React, {Component} from 'react'
import Match from './Match'
import { Switch, Route, Link } from 'react-router-dom'
import './semantic-ui-css/semantic.min.css';
import {Header, Table,Button, Rating,Loader,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'


class MatchNavigator extends Component {

  constructor(props){
    super(props)
    this.state = {}
  }
  componentDidMount() {
    var that = this;

    var base_url = window.location.origin;
    var url = base_url + '/matches/match_info.json'
    fetch(url)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
        console.log(response)
        return response.json();
      })
      .then(function(data) {
      console.log("All matches loaded!")
      that.setState({ data: data ,canary: "hi"});
      });
  }

  render(){
    let matches = []
    if(this.state.canary == "hi"){
      for(let match of this.state.data){
        let match_button = <Dropdown.Item>
          <a href={'#/match/' + match.match_number}  activeClassName="active">
            <div>{match.home}</div>
            <div>VS {match.away}</div>
          </a>
        </Dropdown.Item>
        matches.push(match_button)
        console.log(match)
      }
    }
    let menu = (
      <div className= "App-header">
        <Menu fixed="top" >
          <Menu.Item>OWL Stats</Menu.Item>
          <Menu.Item>
            <Dropdown text = "Matches" scrolling>
              <Dropdown.Menu>
                {matches.map(function(match,i){
                  return match
                })};
              </Dropdown.Menu>
          </Dropdown>
          </Menu.Item>
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
