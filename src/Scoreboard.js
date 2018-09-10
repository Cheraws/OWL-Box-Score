import logo from './logo.svg';
import React, { Component } from 'react';

import './semantic-ui-css/semantic.min.css';
import {Header, Table,Button, Rating,Grid,Menu,Container,Image,List,Icon,Dropdown,Checkbox} from 'semantic-ui-react'
import './App.css';
import _ from 'lodash';




class Scoreboard extends Component {
  constructor(props){
    super(props)
    let players = this.props.players
    this.handleSort = this.handleSort.bind(this)
    this.AssignPlayers = this.AssignPlayers.bind(this)

    this.playerIndex = this.playerIndex.bind(this)
    this.handleStatChange = this.handleStatChange.bind(this)
    this.state = {
      column: null,
      players: this.props.players,
      teams: null,
      direction: null,
      stat_type: "Number"
    }

  }

  handleStatChange(compare) {
    if(compare == "Number"){
        compare = "Percent"
    }
    else{
        compare = "Number"
    }
    let value = this.state
    value["stat_type"] = compare
    this.setState(value);
  }

   AssignPlayers(team_data,team_names) {
    let teams = {}
    for (let team of team_names){
      let shown_keys = ["final_blows", "eliminations", "hero_damage", "deaths", "healing"]
      let player_team_data = []
      let player_entry = {}
      for (let player in team_data[team]['players']){
        let player_entry = {}
        let player_data = team_data[team]['players'][player]
        player_entry["name"] = player
        player_entry["hero_pick"] = {}
        for (let hero in player_data){
          for (let key in player_data[hero]){
            let value = player_data[hero][key]
            if (typeof value == 'number'){
              if (!(key in player_entry)){
                player_entry[key] = 0
              }
              player_entry[key] += Math.trunc(value)
            }
            if(key == "time_played"){
              player_entry["hero_pick"][hero] = value
            }
          }
          
        }
        for(let key of shown_keys){
          if(!(key in player_entry)){ 
            player_entry[key] = 0
          }
        }
          player_team_data.push(player_entry)

      }
      teams[team] = (player_team_data)
    }
     return teams
   }


   playerIndex(team_data,team_names) {
    let teams = {}
    let player_database = {}
    for (let team of team_names){
      let shown_keys = ["final_blows", "eliminations", "hero_damage", "deaths", "healing"]
      let player_team_data = []
      let player_entry = {}
      for (let player in team_data[team]['players']){
        let player_entry = {}
        player_database[player] = player_entry
        let player_data = team_data[team]['players'][player]
        player_entry["name"] = player
        player_entry["hero_pick"] = {}
        for (let hero in player_data){
          for (let key in player_data[hero]){
            let value = player_data[hero][key]
            if (typeof value == 'number'){
              if (!(key in player_entry)){
                player_entry[key] = 0
              }
              player_entry[key] += Math.trunc(value)
            }
            if(key == "time_played"){
              player_entry["hero_pick"][hero] = value
            }
          }
          
        }
        for(let key of shown_keys){
          if(!(key in player_entry)){ 
            player_entry[key] = 0
          }
        }

      }
    }
     return player_database
   }
  
  

  static getDerivedStateFromProps(nextProps, prevState){
    return{
      column: null, 
      player: nextProps.players,
      teams:null,
      direction: null

    }
    
  }
  handleSort = (clickedColumn,teams) => () => {
    let column = this.state.column
    let direction = this.state.direction
    
    if (column != clickedColumn) {
      for(let team in teams){
        teams[team] = _.sortBy(teams[team], [clickedColumn])
      }
      this.setState({
        column: clickedColumn,
        teams: teams,
        direction: 'ascending',
      })
    }
    for(let team in teams){
      teams[team] = teams[team].reverse()
    }
    this.setState({
      teams: teams,
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    })
  }

  render() {
    let columnWidth =   7
    let header_css = "Stat-header"
    let cell_css = "Stat-text"
    if(this.props.screenWidth < 500){
      columnWidth = 16
      header_css = "Stat-mobile-header"
      cell_css = "Stat-mobile-text"

    }

    let teams = this.state.teams
    let team_names = this.props.team_names
    if(this.state.teams == null){
      teams = this.AssignPlayers(this.props.teams,team_names)
    }
    let player_values = this.playerIndex(this.props.teams,team_names)

    let direction = this.state.direction
    let column = this.state.column
    let team_stats = {}
    let divide_team_stats = {}
    for(let team of team_names){
      team_stats[team] = {
        'final_blows': 0,
        'eliminations': 0,
        'deaths': 0,
        'hero_damage': 0,
        'healing': 0
      }
      for(let i = 0; i < teams[team].length; i++){
        let player_stats = teams[team][i]
        for(let key in team_stats[team]){
          team_stats[team][key] += player_stats[key]
        }
      }
      if (this.state.stat_type == "Percent"){
        for(let i = 0; i < teams[team].length; i++){
          let player_stats = player_values[teams[team][i].name]
          for(let key in team_stats[team]){
            if (team_stats[team][key] == 0){
              continue
            }
            player_stats[key] = Math.floor(player_stats[key] / team_stats[team][key] * 100)
          }
        }
      }
    }
    return (
      <Grid centered>
      <Grid.Row>
        <Checkbox toggle 
          label={this.state.stat_type}
          value = {this.state.stat_type}
          onChange={() => this.handleStatChange(this.state.stat_type)}
        />
      </Grid.Row>
      <Grid.Row>
      {Object.keys(teams).map(function(team,i){
        var n = team.split(" ");
        var team_name = n[n.length - 1];
        var picture_path = "/images/" + team.replace(/ /g,"_") + ".svg"
        return(
        <Grid.Column width = {columnWidth}>
        <Table unstackable sortable striped selectable>
          <Table.Header>
            <Table.Row className={header_css}>
              <Table.HeaderCell width={3}>
                <img src={picture_path} className={"scoreboard_image"}/>
              </Table.HeaderCell>
              <Table.HeaderCell  width={5}>
                {team_name}
              </Table.HeaderCell>
              <Table.HeaderCell width={1} sorted={column === 'final_blows' ? direction : null} onClick={this.handleSort('final_blows',teams)}>
                FB
              </Table.HeaderCell>
              <Table.HeaderCell width={1} sorted={column === 'eliminations' ? direction : null} onClick={this.handleSort('eliminations',teams)}>
                E
              </Table.HeaderCell>
              <Table.HeaderCell width={1} sorted={column === 'deaths' ? direction : null} onClick={this.handleSort('deaths',teams)}>
                D
              </Table.HeaderCell>
              <Table.HeaderCell width={1} sorted={column === 'hero_damage' ? direction : null} onClick={this.handleSort('hero_damage',teams)}>
                Dmg
              </Table.HeaderCell>
              <Table.HeaderCell width={1} sorted={column === 'healing' ? direction : null} onClick={this.handleSort('healing',teams)}>
                Heals
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
          {teams[team].map(function(player,i){
            let player_info = player_values[player.name]
            let hero_pool = player_info["hero_pick"]
            var hero = _.maxBy(_.keys(hero_pool), function (o) { return hero_pool[o]; });
            let hero_path = "/images/" + hero.replace(".","") + ".png"
            return(
              <Table.Row className={cell_css}>
                <Table.Cell>
                  <img src={hero_path} className={"scoreboard_hero_image"}/>
                </Table.Cell>
                <Table.Cell>
                  {player_info.name} 
                </Table.Cell>
                <Table.Cell>
                  {player_info["final_blows"]} 
                </Table.Cell>
                <Table.Cell>
                  {player_info['eliminations']} 
                </Table.Cell>
                <Table.Cell>
                  {player_info['deaths']} 
                </Table.Cell>
                <Table.Cell>
                  {player_info['hero_damage']} 
                </Table.Cell>
                <Table.Cell>
                  {player_info['healing']} 
                </Table.Cell>
              </Table.Row>
            );
          })}
              <Table.Row className={cell_css}>
                <Table.HeaderCell>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  Total
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {team_stats[team]["final_blows"]} 
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {team_stats[team]["eliminations"]}
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {team_stats[team]['deaths']} 
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {team_stats[team]['hero_damage']} 
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {team_stats[team]['healing']} 
                </Table.HeaderCell>
              </Table.Row>
          </Table.Body>
        </Table>
        </ Grid.Column>
        );
      },this)}
      </Grid.Row>
      <Grid.Row>
      <Grid.Row>
        <h3>LEGEND</h3>
      </Grid.Row>
      </Grid.Row>
          <List>
            <List.Item>FB:Final Blows</List.Item>
            <List.Item>E: Eliminations</List.Item>
            <List.Item>D: Deaths</List.Item>
            <List.Item>DMG: Hero Damage</List.Item>
            <List.Item>Heals: Healing Done</List.Item>
          </List>
      <Grid.Row />
      </Grid>

    );
  }
}


export default Scoreboard;
