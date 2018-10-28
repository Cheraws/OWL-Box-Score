import React, { Component } from 'react';
import logo from './logo.svg';
import './semantic-ui-css/semantic.min.css';
import {Header, Table,Button, Rating,Loader,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'
import './App.css';
import LineGraph from './LineGraph.js'
import Scoreboard from './Scoreboard.js'
import MatchScore from './MatchScore.js'
import RoundScore from './RoundScore.js'
import matchs from './game.json'

import * as firebase from "firebase";
import {databaseRef} from "./config/firebase.js"

import Compare from './Compare.js'
import PickRates from './PickRates.js'
import CompareWrapper from './CompareWrapper.js'

class MatchInfo extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.onDropdown = this.onDropdown.bind(this)
    this.onMatchChange = this.onMatchChange.bind(this)
    this.state = { screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120, currentRound: "Overall", currentMatch: 0}
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    var that = this;
    let mobile = false;
    let number = this.props.match.params.number
    let stage = this.props.match.params.stage
    if(window.innerWidth < 500){
       mobile = true
    }
    if (number == undefined){
      number = 0
    }
    
    firebase.auth().onAuthStateChanged(function(user) {
      databaseRef.ref("stages/" + stage +  "/match_data/" + number.toString()).once("value").then(function(snapshot){
        let val = snapshot.val()
        that.setState({ data: val ,canary: "hi", number: number,screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120, mobile:mobile, total_match: null });
      })
    })
  }

  componentDidUpdate(prevProps) {
    console.log("Am here")
    var that = this
    let number = this.props.match.params.number
    let stage = this.props.match.params.stage
    if(number == this.state.number || (number == undefined && this.state.number == 0)){
      console.log("website already loaded")
      return
    }
    if (number == undefined){
      number = 0
    }
    if(this.state.canary == "hi"){
      this.setState({canary:null})
    }
    firebase.auth().onAuthStateChanged(function(user) {
      databaseRef.ref("stages/" + stage +  "/match_data/" + number.toString()).once("value").then(function(snapshot){
        let val = snapshot.val()
        that.setState({ data: val ,canary: "hi", number: number,screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120, total_match: null });
      })
    })
  }

  onResize() {
    let mobile = false
    if(window.innerWidth < 500){
       mobile = true
    }
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120, mobile:mobile })
  }

  onDropdown(i) {

    this.setState({ currentRound: i })
  }

  onMatchChange(i) {
    console.log("doing something?")
    this.setState({ currentRound: "Overall", currentMatch: i})
  }



  render() {
    if(this.state.canary == null){
      return <Loader active inline='centered' />
    }
    console.log(this.state.data)
    let match = this.state.data['match']
    let team_names = this.state.data['teams']

    // Setting up the overall match data structure.
    let total_match = {}
    total_match['map_name'] = "Match Score"
    total_match['teams'] = {}

    for (let i = 0; i< 5; i++){
      if(!(match[i])){
        continue;
      }
      let teams = match[i].teams
      for(let team of team_names){
        if (!(team in total_match['teams'])){
          total_match['teams'][team] = {}
          total_match['teams'][team]['players'] = {}
        }
        for (let player in teams[team]['players']){
          if (!(player in total_match['teams'][team]['players'])){
            total_match['teams'][team]['players'][player] = {}
          }
          let player_data = teams[team]['players'][player]
          for (let hero in player_data){
            if (!(hero in total_match['teams'][team]['players'][player])){
              total_match['teams'][team]['players'][player][hero] = {}
            }
            let hero_data = total_match['teams'][team]['players'][player][hero] 
            for (let key in player_data[hero]){
              let value = player_data[hero][key]
              if (typeof value == 'number'){
                if (!(key in hero_data)){
                  hero_data[key] = 0
                }
                hero_data[key] += Math.trunc(value)
              }
            }
          }
        }
      }
    }

    let maps = []
    let overall_teams = null
    let overall_players = []
    let dropdown_content = []
    let dropdown_values = {}
    

    //first panel
    let teams = total_match.teams
    let panes = [
      { menuItem: 'Box Score', render: () => <Tab.Pane>
        <Scoreboard 
        screenWidth={this.state.screenWidth}
        teams={teams}
        team_names={team_names}
        mobile={this.state.mobile}/>
        </Tab.Pane> 
      },
      { menuItem: 'Compare', render: () => <Tab.Pane>
        <CompareWrapper
        team_names={team_names}
        screenWidth={this.state.screenWidth}
        teams={teams}
        mobile={this.state.mobile}/>
        </Tab.Pane> },
        { menuItem: 'Pick Rates', render: () => <Tab.Pane>
          <PickRates
          screenWidth={this.state.screenWidth}
          teams={teams} 
          team_names={team_names}
          mobile={this.state.mobile}/>
          </Tab.Pane> },
    ]

    let content = <div>
          <MatchScore
          screenWidth={this.state.screenWidth}
          data={this.state.data}
          team_names={team_names}
          mobile={this.state.mobile}/>
                  <Tab panes={panes} />
                </div> 

    let entry = {menuItem: 'Overall', render: () =>
      <Tab.Pane className={"round-tabs"}> 
        <div className={"round-tabs"}>
          {content}
        </div> 
      </Tab.Pane> }


    let match_button = <Dropdown.Item
        onClick={()=> this.onDropdown("Overall")}>
        Overall
    </Dropdown.Item>

    dropdown_content.push(match_button)

    dropdown_values["Overall"] = content
    maps.push(entry)


    for (let i = 0; i < 5; i++){
      if(!(match[i])){
        let entry = {menuItem: 'Round ' + (i+1), render: () =>
            <Tab.Pane className={"round-tabs"}> 
              <div className={"round-tabs"}>
                <div> DNP or bugged </div>
              </div> 
            </Tab.Pane> }
        continue
      }
      let match_button = <Dropdown.Item
          onClick={()=> this.onDropdown("Round " + (i+1))}>
          Round {i+1}

      </Dropdown.Item>
      dropdown_content.push(match_button)
      let teams = match[i].teams
      let panes = [
        { menuItem: 'Box Score', render: () => <Tab.Pane>

            <Scoreboard 
            screenWidth={this.state.screenWidth}
            teams={teams} 
            team_names={team_names}
            mobile={this.state.mobile}/>
          </Tab.Pane> },
        { menuItem: 'Compare', render: () => <Tab.Pane>
          <CompareWrapper
          screenWidth={this.state.screenWidth}
          teams={teams} 
          team_names={team_names}
          mobile={this.state.mobile}/>
          </Tab.Pane> },
        { menuItem: 'Pick Rates', render: () => <Tab.Pane>
          <PickRates
          screenWidth={this.state.screenWidth}
          teams={teams} 
          team_names={team_names}
          mobile={this.state.mobile}/>
          </Tab.Pane> },

      ]

      let content = <div>
            <RoundScore
            screenWidth={this.state.screenWidth}
            teams ={teams}
            team_names={team_names}
            map_name={match[i]["map_name"]}
            mobile={this.state.mobile}/>
                    <Tab panes={panes} />
                  </div> 

      dropdown_values["Round " + (i+1)] = content
      let entry = {menuItem: 'Round ' + (i+1), render: () =>
        <Tab.Pane className={"round-tabs"}> 
          <div className={"round-tabs"}>
            {content}
          </div> 
        </Tab.Pane> }
      maps.push(entry)
    }
    let body = ""
    let map_tabs = <Tab panes= {maps} />

    if(this.state.mobile == true){
      return(

        <div className="App">
          <div>
          <Dropdown text = {this.state.currentRound} className={"Dropdown-padding"}>
              <Dropdown.Menu>
                 {dropdown_content.map(function(round,i){
                    return round
                 })};
              </Dropdown.Menu>
          </Dropdown>
          </div>
          {dropdown_values[this.state.currentRound]}
        </div>
      )
    }
    return (

      <div className="App">
        {map_tabs}
      </div>
    );
  }
}

export default MatchInfo;
