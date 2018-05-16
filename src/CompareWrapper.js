import React, { Component } from 'react';
import logo from './logo.svg';
import './semantic-ui-css/semantic.min.css';
import {Header, Table,Button, Rating,Checkbox,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'
import './App.css';
import LineGraph from './LineGraph.js'
import Scoreboard from './Scoreboard.js'
import Compare from './Compare.js'

class CompareWrapper extends Component {
  constructor(props){
    super(props)
    let teams = {}
    this.state = {left: null, right:null, compare: "players", stat:"Total"}
    this.onChange = this.onChange.bind(this)

    this.onStatChange = this.onStatChange.bind(this)
    this.handleComparisonChange = this.handleComparisonChange.bind(this)
  }

  onChange(left,right) {
    this.setState({ left: left, right:right})       
  }
  onStatChange(stat) {
    this.setState({stat:stat})       
  }


  handleComparisonChange(compare) {
    if(compare == "players"){
        compare = "teams"
    }
    else{
        compare = "players"
    }
    this.setState({compare:compare });
  }

  static getDerivedStateFromProps(nextProps, prevState){
    return {left: null, right:null, compare: "players"}
  }


  render() {
    let left_dropdown = []
    let right_dropdown = []
    teams = {}
    let players = this.props.players
    let left = this.state.left
    let right= this.state.right
    let teams = {}
    for(let player in this.props.players){
      let team = players[player].team
      if(!(team in teams)){
        teams[team] = []
      }   
      teams[team].push(player)
    }
    let compared = []
    for(let team in teams){
      compared.push(teams[team][0])
    }
    if(this.state.left == null){
      left = compared[0]
      right = compared[1]
    }

    for(let team in teams){
      let team_indicator = <Dropdown.Item><div className="Dropdown-team-name">{team}</div></Dropdown.Item>
      left_dropdown.push(team_indicator)
      for(let i = 0; i < teams[team].length; i++){
        let player = teams[team][i]
        let match_button = <Dropdown.Item 
            onClick={()=> this.onChange(player, right)}
          >
          {player}
        </Dropdown.Item>
        left_dropdown.push(match_button)
      }
    }

    for(let team in teams){
      let team_indicator = <Dropdown.Item><div className="Dropdown-team-name">{team}</div></Dropdown.Item>
      right_dropdown.push(team_indicator)
      for(let i = 0; i < teams[team].length; i++){
        let player = teams[team][i]
        let match_button = <Dropdown.Item 
            onClick={()=> this.onChange(left, player)}
          >
          {player}
        </Dropdown.Item>
        right_dropdown.push(match_button)
      }
    }
    let dropdown_width = 8
    let right_dropdown_css="right-dropdown"
    if(this.props.mobile == true){
      dropdown_width = 16
      right_dropdown_css=""
    }
    let playerSelection = (
        <Grid.Row>
          <Grid.Column width={dropdown_width}>
            <Dropdown text = {left}  selection>
              <Dropdown.Menu>
                 {left_dropdown.map(function(player,i){
                    return player
                 })}
              </Dropdown.Menu>
            </Dropdown>
          </Grid.Column>
          <Grid.Column width={dropdown_width}>
            <Dropdown text = {right}  selection className = {right_dropdown_css} >
              <Dropdown.Menu>
                 {right_dropdown.map(function(player,i){
                    return player
                 })}
              </Dropdown.Menu>
            </Dropdown>
          </Grid.Column>
        </Grid.Row>

    )
    let stat_types = ["Total", "per 10 min", "per min"]
    let stat_dropdown = []

   for(let stat of stat_types){
      let player = stat
      let match_button = <Dropdown.Item 
            onClick={()=> this.onStatChange(stat)}
          >
          {stat}
        </Dropdown.Item>
        stat_dropdown.push(match_button)
    }

    let statSelection = (
        <Grid.Row>
          <Grid.Column width={16}>
            <Dropdown text = {this.state.stat}  selection>
              <Dropdown.Menu>
                 {stat_dropdown.map(function(stat,i){
                    return stat
                 })}
              </Dropdown.Menu>
            </Dropdown>
          </Grid.Column>
        </Grid.Row>
    )
    if(this.state.compare == "teams"){
      playerSelection = ""
    }
    return (
      <div>
      <Grid className="App" centered>
        <div className="checkbox">
          <Grid.Row>
            <Checkbox toggle 
              label={"Compare " + this.state.compare}
              value = {this.state.compare}
              onChange={() => this.handleComparisonChange(this.state.compare)}
            />
          </Grid.Row>
        </div>
        {statSelection}
        {playerSelection}
      </Grid>
      <Compare players={this.props.players} left={left} right={right} screenWidth={this.props.screenWidth} compare={this.state.compare} teams={this.props.teams} stat_type={this.state.stat}/>
      </div>
    );
  }
}

export default CompareWrapper;
