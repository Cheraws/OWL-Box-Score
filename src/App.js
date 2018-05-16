import React, { Component } from 'react';
import logo from './logo.svg';
import './semantic-ui-css/semantic.min.css';
import {Header, Table,Button, Rating,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'
import './App.css';
import LineGraph from './LineGraph.js'
import Scoreboard from './Scoreboard.js'
import MatchScore from './MatchScore.js'
import RoundScore from './RoundScore.js'
import games from './games.json'

import Compare from './Compare.js'

import CompareWrapper from './CompareWrapper.js'

class App extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.onDropdown = this.onDropdown.bind(this)
    this.onMatchChange = this.onMatchChange.bind(this)
    this.state = { screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120, currentRound: "Overall", currentMatch: 0}
  }
  onResize() {
    //If mobile, use dropdown!
    let mobile = false
    if(window.innerWidth < 500){
       mobile = true
    }
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120, mobile:mobile })
  }
  onDropdown(i) {
    //If mobile, use dropdown!

    this.setState({ currentRound: i })
  }
  onMatchChange(i) {
    //If mobile, use dropdown!
    console.log("doing something?")
    this.setState({ currentRound: "Overall", currentMatch: i})
  }
  componentDidMount(){
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }


  render() {
    let matches = []
    for(let i = 0 ; i < games.length; i++){
      let game = games[i]
      let team_1 = game[i].teams[0].name
      let team_2 = game[i].teams[1].name
      let match_button = <Dropdown.Item
          onClick={()=> this.onMatchChange(i)}>
        {team_1} VS 
        <div>
          {team_2}
        </div>
      </Dropdown.Item>
      matches.push(match_button)
    }

    let menu = (
      <div className= "App-header">
        <Menu fixed="top" inverted>
          <Menu.Item>Playoff Stats</Menu.Item>
          <Menu.Item>
            <Dropdown text = "Matches">
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

    let game = games[this.state.currentMatch]
    let maps = []
    let panes = []
    let overall_teams = null
    let overall_players = []
    let dropdown_content = []
    let dropdown_values = {}
    for(let i = 0; i< game.length; i++){
      let players = game[i].players
      if(overall_teams == null){
        overall_teams = game[i].teams
      }
      for(let player in players){
        let game_length = players[player].game_length
        let player_info = players[player].data[game_length-1]
        if (!(player in overall_players)){
          let game_length = players[player].game_length
          let cloned_player =  JSON.parse(JSON.stringify(players[player]))
          cloned_player.data = [cloned_player.data[game_length-1]]
          cloned_player.game_length = 1
          overall_players[player] = cloned_player
        }
        else{
          let concurrent_stats = overall_players[player].data[0]
          let stats  = ['Hero Damage Done', 'Healing Done', 'Solo Kills', 'Best Kill Streak', 'Deaths', 'Final Blows',     'Defensive Assists', 'Offensive Assists', 'Eliminations',  'Objective Kills','Assists']
          for(let stat of stats){
            if (stat in player_info){
              if(!(stat in concurrent_stats)){
                concurrent_stats[stat] = 0
              }
              concurrent_stats[stat] += player_info[stat]
            }
          }
          for(let key of ['hero_pick', 'uncertain_hero_pick']){
            if((key in player_info)){
              let new_round_heroes = player_info[key]
              if(!(key in concurrent_stats)){
                concurrent_stats[key] = {}
              }
              let old_round_heroes = concurrent_stats[key]
              for(let hero in new_round_heroes){
                if(!(hero in old_round_heroes)){
                  old_round_heroes[hero] = 0
                }
                old_round_heroes[hero] += new_round_heroes[hero]
              }

            }
          }
        }
      }
    }

    let match_button = <Dropdown.Item
          onClick={()=> this.onDropdown("Overall")}>
          Overall
        </Dropdown.Item>
    dropdown_content.push(match_button)

    let initial_pane = [
        {menuItem: 'Box Score', render:() => <Tab.Pane><Scoreboard players={overall_players} screenWidth={this.state.screenWidth} teams={overall_teams} /></Tab.Pane> },
        {menuItem: 'Compare', render:() => 
          <Tab.Pane> 
            <CompareWrapper players={overall_players} 
                screenWidth={this.state.screenWidth}
                teams={overall_teams}
                mobile={this.state.mobile}
            />

          </Tab.Pane> }
    ]
    let initial_value =       
        <div>
          <MatchScore players={overall_players} game={game} mobile={this.state.mobile}/>
          <Tab panes={initial_pane} />
        </div>
    let initial_tab_entry = {menuItem: 'Overall', render: () =>
      <Tab.Pane> 
        <div>
          <MatchScore players={overall_players} game={game} />
          <Tab panes={initial_pane} />
        </div>
      </Tab.Pane> }
    maps.push(initial_tab_entry)
    dropdown_values["Overall"] = initial_value

    for (let i = 0; i < game.length; i++){
      let players = game[i].players
      let teams = game[i].teams
      let map_type = game[i].map_type
      let panes = [
        { menuItem: 'Box Score', render: () => <Tab.Pane>
          <Scoreboard players={players}
          screenWidth={this.state.screenWidth}
          teams={teams} map_type={map_type} 
          mobile={this.state.mobile}/>
          </Tab.Pane> },
        { menuItem: 'Compare', render: () => <Tab.Pane> 
          <CompareWrapper players={players} 
            screenWidth={this.state.screenWidth}
            teams={teams} 
            mobile={this.state.mobile} />
          </Tab.Pane> },
        { menuItem: 'Graph', render: () => 
          <Tab.Pane>
            <LineGraph players={players} screenWidth={this.state.screenWidth} teams={teams} /> 
          </Tab.Pane> },
      ]
      let match_button = <Dropdown.Item
          onClick={()=> this.onDropdown("Round " + (i+1))}>
          Round {i+1}
      </Dropdown.Item>

      dropdown_content.push(match_button)
      let content = <div>
                    <RoundScore teams={teams} map_type={map_type} map={game[i]}/>
                    <Tab panes={panes} />
                  </div> 

      dropdown_values["Round " + (i+1)] = content
      let entry = {menuItem: 'Round ' + (i+1), render: () =>
        <Tab.Pane> 
          <div>
            {content}
          </div> 
        </Tab.Pane> }
      maps.push(entry)
    }
    let body = ""
    let return_value = <Tab panes= {maps} />

    if(this.state.mobile == true){
      return(

        <div className="App">
          {menu}
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
        {menu}
        {return_value}
      </div>
    );
  }
}

export default App;
