import React, { Component } from 'react';
import logo from './logo.svg';
import './semantic-ui-css/semantic.min.css';
import {Header, Table,Button, Rating,Loader,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'
import './App.css';
import LineGraph from './LineGraph.js'
import Scoreboard from './Scoreboard.js'
import MatchScore from './MatchScore.js'
import RoundScore from './RoundScore.js'
import games from './game.json'

import Compare from './Compare.js'
import PickRates from './PickRates.js'
import CompareWrapper from './CompareWrapper.js'

class MatchInfo extends Component {
  constructor(props){
    console.log(props)
    super(props)
    this.onResize = this.onResize.bind(this)
    this.onDropdown = this.onDropdown.bind(this)
    this.onMatchChange = this.onMatchChange.bind(this)
    this.state = { screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120, currentRound: "Overall", currentMatch: 0}
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    console.log("appear?")
    var that = this;
    let mobile = false;
    let number = this.props.match.params.number
    if(window.innerWidth < 500){
       mobile = true
    }
    if (number == undefined){
      number = 0
    }
    console.log(number)
    var base_url = window.location.origin;
    var url = base_url + '/matches/'  + number + '/game.json'
    console.log(url)
    console.log("HI?")
    fetch(url)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
        console.log(response)
        return response.json();
      })
      .then(function(data) {
      that.setState({ data: data ,canary: "hi", number: number,screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120, mobile:mobile });
      });
  }

  componentDidUpdate(prevProps) {
    var that = this
    let number = this.props.match.params.number
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
    console.log("URL update!")
    var base_url = window.location.origin;
    var url = base_url + '/matches/'  + number + '/game.json'
    console.log(url)
    console.log("HI?")
    fetch(url)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
        const contentType = response.headers.get("content-type");
        console.log(contentType)
        console.log(response)
        return response.json();
      })
      .then(function(data) {
      that.setState({ data: data ,canary: "hi", number: number});
      });
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



  render() {
    console.log(this.props)
    console.log(this.props.match.params)
    console.log(this.state.data)
    console.log(this.state.canary)
    let games = this.state.data

    if(this.state.canary == null){
      return <Loader active inline='centered' />
    }
    

    let game = games[0]
    let maps = []
    let panes = []
    let overall_teams = null
    let overall_players = []
    let dropdown_content = []
    let dropdown_values = {}
    //Creating the overall profile and treating is as one really big file.
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
        {menuItem: 'Pick Rates', render:() => <Tab.Pane><PickRates players={overall_players} screenWidth={this.state.screenWidth} teams={overall_teams} /></Tab.Pane> },
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
        <div className={"round-tabs"}>
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
  {menuItem: 'Pick Rates', render:() => <Tab.Pane>
      <PickRates 
        players={players} 
        screenWidth={this.state.screenWidth} 
        teams={teams} />
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
