import React, { Component } from 'react';
import logo from './logo.svg';
import './semantic-ui-css/semantic.min.css';
import {Header, Table,Button, Rating,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'
import './App.css';
import LineGraph from './LineGraph.js'
import Scoreboard from './Scoreboard.js'
import Compare from './Compare.js'

class CompareWrapper extends Component {
  constructor(props){
    super(props)
    let teams = {}
    for(let player in this.props.players){
      let team = this.props.players[player][0].team
      if(!(team in teams)){
        teams[team] = []
      }   
      teams[team].push(player)
    }
    let compared = []
    for(let team in teams){
      compared.push(teams[team][0])
    }
    this.state = {left: compared[0], right:compared[1], teams:teams}
    this.onLeft= this.onLeft.bind(this)
    this.onRight= this.onRight.bind(this)
    
    console.log(compared)
  }
  onLeft(d) {
    this.setState({ left: d})       
  }
  onRight(d) {
    this.setState({ right: d})       
  }
  static getDerivedStateFromProps(nextProps, prevState){
    let teams = {}
    for(let player in nextProps.players){
      console.log(player)
      let team = nextProps.players[player][0].team
      if(!(team in teams)){
        teams[team] = []
      }   
      teams[team].push(player)
    }
    let compared = []
    for(let team in teams){
      compared.push(teams[team][0])
    }
    return {left: compared[0], right:compared[1], teams:teams}

  }


  render() {
    let left_dropdown = []
    let right_dropdown = []
    for(let team in this.state.teams){
      let team_indicator = <Dropdown.Item><div className="Dropdown-team-name">{team}</div></Dropdown.Item>
      left_dropdown.push(team_indicator)
      for(let i = 0; i < this.state.teams[team].length; i++){
        let player = this.state.teams[team][i]
        let match_button = <Dropdown.Item 
            onClick={()=> this.onLeft(player)}
          >
          {player}
        </Dropdown.Item>
        left_dropdown.push(match_button)
      }
    }

    for(let team in this.state.teams){
      let team_indicator = <Dropdown.Item><div className="Dropdown-team-name">{team}</div></Dropdown.Item>
      right_dropdown.push(team_indicator)
      for(let i = 0; i < this.state.teams[team].length; i++){
        let player = this.state.teams[team][i]
        let match_button = <Dropdown.Item 
            onClick={()=> this.onRight(player)}
          >
          {player}
        </Dropdown.Item>
        right_dropdown.push(match_button)
      }
    }

    console.log(this.state.left)


    return (
      <div>
      <Grid className="App" centered>
        <Grid.Row>

          <Grid.Column width={4}>
            <Dropdown text = {this.state.left}>
              <Dropdown.Menu>
                 {left_dropdown.map(function(stat,i){
                    return stat
                 })};
              </Dropdown.Menu>
            </Dropdown>
          </Grid.Column>
          <Grid.Column width={4}>
            <Dropdown text = {this.state.right} className={'right-dropdown'}>
              <Dropdown.Menu>
                 {right_dropdown.map(function(stat,i){
                    return stat
                 })};
              </Dropdown.Menu>
            </Dropdown>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Compare players={this.props.players} left={this.state.left} right={this.state.right} screenWidth={this.props.screenWidth} />
      </div>
    );
  }
}

export default CompareWrapper;
