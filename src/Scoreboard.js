import logo from './logo.svg';
import React, { Component } from 'react';

import './semantic-ui-css/semantic.min.css';
import {Header, Table,Button, Rating,Grid,Menu,Container,Image,List,Icon,Dropdown} from 'semantic-ui-react'
import './App.css';
import _ from 'lodash';




class Scoreboard extends Component {
  constructor(props){
    super(props)
    let players = this.props.players
    this.handleSort = this.handleSort.bind(this)
    this.AssignPlayers = this.AssignPlayers.bind(this)
    this.state = {
      column: null,
      players: this.props.players,
      teams: null,
      direction: null
    }

  }

   AssignPlayers(players,team_to_player) {
    let game_length;
    let teams = []
    for(let team of team_to_player){
      teams[team.name] = []
    }
    for (let player in players){
      game_length = players[player].game_length
      let team = players[player].team
      let player_info = players[player].data[game_length-1]
      let player_scoreboard = {}
      player_scoreboard.name = player
      for(let key in player_info){
        player_scoreboard[key] = player_info[key]  
      }
      teams[team].push(player_scoreboard)
    };
     return teams
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
    let players = this.props.players
    let columnWidth =   7
    let header_css = "Stat-header"
    let cell_css = "Stat-text"
    if(this.props.screenWidth < 500){
      columnWidth = 16
      header_css = "Stat-mobile-header"
      cell_css = "Stat-mobile-text"

    }

    let teams = this.state.teams
    if(teams == null){
      teams = this.AssignPlayers(this.props.players,this.props.teams)
    }
    let game_length = this.state.game_length
    let direction = this.state.direction
    let column = this.state.column
    let team_stats = {}

    for(let team in teams){
      team_stats[team] = {
        'Final Blows': 0,
        'Eliminations': 0,
        'Assists': 0,
        'Deaths': 0,
        'Hero Damage Done': 0,
        'Healing Done': 0
      }
      for(let i = 0; i < teams[team].length; i++){
        let player_stats = teams[team][i]
        for(let key in team_stats[team]){
          team_stats[team][key] += player_stats[key]
        }
      }

    }
    return (
      <Grid centered>
      <Grid.Row>
      {Object.keys(teams).map(function(team,i){
        var n = team.split(" ");
        var team_name = n[n.length - 1];
        var picture_path = "images/" + team.replace(/ /g,"_") + ".svg"
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
              <Table.HeaderCell width={1} sorted={column === 'Final Blows' ? direction : null} onClick={this.handleSort('Final Blows',teams)}>
                K
              </Table.HeaderCell>
              <Table.HeaderCell width={1} sorted={column === 'Eliminations' ? direction : null} onClick={this.handleSort('Eliminations',teams)}>
                E
              </Table.HeaderCell>
              <Table.HeaderCell width={1} sorted={column === 'Assists' ? direction : null} onClick={this.handleSort('Assists',teams)}>
                A
              </Table.HeaderCell>
              <Table.HeaderCell width={1} sorted={column === 'Deaths' ? direction : null} onClick={this.handleSort('Deaths',teams)}>
                D
              </Table.HeaderCell>
              <Table.HeaderCell width={1} sorted={column === 'Hero Damage Done' ? direction : null} onClick={this.handleSort('Hero Damage Done',teams)}>
                Dmg
              </Table.HeaderCell>
              <Table.HeaderCell width={1} sorted={column === 'Healing Done' ? direction : null} onClick={this.handleSort('Healing Done',teams)}>
                Heals
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
          {teams[team].map(function(player,i){
            let player_info = player
            let hero_pool = player_info["hero_pick"]
            var hero = _.maxBy(_.keys(hero_pool), function (o) { return hero_pool[o]; });
            let hero_path = "images/" + hero.replace(".","") + ".png"
            return(
              <Table.Row className={cell_css}>
                <Table.Cell>
                  <img src={hero_path} className={"scoreboard_hero_image"}/>
                </Table.Cell>
                <Table.Cell>
                  {player_info.name} 
                </Table.Cell>
                <Table.Cell>
                  {player_info["Final Blows"]} 
                </Table.Cell>
                <Table.Cell>
                  {player_info.Eliminations} 
                </Table.Cell>
                <Table.Cell>
                  {parseInt(player_info["Assists"]) } 
                </Table.Cell>
                <Table.Cell>
                  {player_info.Deaths} 
                </Table.Cell>
                <Table.Cell>
                  {player_info['Hero Damage Done']} 
                </Table.Cell>
                <Table.Cell>
                  {player_info['Healing Done']} 
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
                  {team_stats[team]["Final Blows"]} 
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {team_stats[team].Eliminations} 
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {team_stats[team]["Assists"] } 
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {team_stats[team]['Deaths']} 
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {team_stats[team]['Hero Damage Done']} 
                </Table.HeaderCell>
                <Table.HeaderCell>
                  {team_stats[team]['Healing Done']} 
                </Table.HeaderCell>
              </Table.Row>
          </Table.Body>
        </Table>
        </ Grid.Column>
        );
      },this)}
      </Grid.Row>

      </Grid>
    );
  }
}


export default Scoreboard;
