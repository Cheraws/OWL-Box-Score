import logo from './logo.svg';
import React, { Component } from 'react';

import './semantic-ui-css/semantic.min.css';
import {Header,Checkbox,Table,Button, Rating,Popup, Grid,Menu,Container,Image,List,Icon,Dropdown} from 'semantic-ui-react'
import './App.css';
import _ from 'lodash';
import players from './players.json'




class Compare extends Component {



  render() {
    let players = this.props.players
    let teams = this.props.teams
    let stats  = ['Hero Damage Done', 'Healing Done',  'Final Blows', 'Deaths', 'Defensive Assists', 'Offensive Assists', 'Eliminations',  'Objective Kills','Assists', 'Solo Kills']
    let stat_type = this.props.stat_type
    let left = this.props.left
    let right = this.props.right
    let game_length = players[left].game_length
    let player_1 = players[left].data[game_length-1]
    let player_2 = players[right].data[game_length-1]
    
    if(this.props.compare == "teams"){
      let team_list = []
      let team_players = {}
      let game_length = players[left].game_length
      for(let team of teams){
        team_players[team.name] = {}
        team_list.push(team.name)
        team_players[team.name]["hero_pick"] = {}
      }
      for(let player in players){
        let player_data = players[player].data[game_length-1]
        let player_team = players[player].team
        for(let stat of stats){
          if(!(stat in team_players[player_team])){
            team_players[player_team][stat] = 0
          }
          team_players[player_team][stat] += player_data[stat]
        }
        for(let hero in player_data["hero_pick"]){
          if(!(hero in team_players[player_team]["hero_pick"])){
            team_players[player_team]["hero_pick"][hero] = 0
          }
          team_players[player_team]["hero_pick"][hero] += player_data["hero_pick"][hero]
        }
      }
      player_1 = team_players[team_list[0]]
      player_2 = team_players[team_list[1]]
      left = team_list[0]
      right = team_list[1]
    }

    //check for mobile compatibility
    let columnWidth = 16
    let header_css = "Compare-header"
    let cell_css = "Compare-text"
    let hero_css = "compare-hero-image"
    let team_logo_width = 1

    if(this.props.screenWidth < 500){
      columnWidth = 16
      team_logo_width = 2
      hero_css = "compare-hero-image-mobile"
      header_css = "Compare-mobile-header"
      cell_css = "Compare-mobile-text"
    }

    let hero_popups_by_player = []
    let player_minutes = []
    let total_times = []
    //set times for each player.
    for(let player of [player_1,player_2]){
      let player_popups = []
      let player_heroes = _.sortBy(_.keys(player["hero_pick"]), function(hero){ return player["hero_pick"][hero]})
      let total_time = 0
      for(let hero of player_heroes.reverse()){
        let date = new Date(null);
        date.setSeconds(4*player["hero_pick"][hero]);
        total_time += 4 * player["hero_pick"][hero]
        let hero_time = date.toISOString().substr(11, 8);
        let hero_path = "images/" + hero.replace(".","") + ".png"
        let hero_entry = <Popup
          key={hero_path}
          trigger={<img src={hero_path} className={hero_css}/>}
          header={hero}
          content={hero_time}
        />
        player_popups.push(hero_entry)
      }
      if(this.props.compare == 'team'){
        total_time = total_time / 6
      }
      player_minutes.push(total_time/60)
      let date = new Date(null);
      date.setSeconds(total_time);

      let hero_time = date.toISOString().substr(11, 8);
      total_times.push(hero_time)
      hero_popups_by_player.push(player_popups)
    }
    let player_1_path, player_2_path, player_1_team, player_2_team

    if(this.props.compare == "players"){
      player_1_path = "images/" + players[left].team.replace(/ /g,"_")  + ".svg"
      player_2_path = "images/" + players[right].team.replace(/ /g,"_")  + ".svg"
      player_1_team = <img src={player_1_path} className={"scoreboard_image"}/>
      player_2_team = <img src={player_2_path} className={"scoreboard_image"}/>
    }

    else{
      player_1_path = "images/" + left.replace(/ /g, "_") + ".svg"
      player_2_path = "images/" + right.replace(/ /g,"_")  + ".svg"
      player_1_team = <img src={player_1_path} className={"scoreboard_image"}/>
      player_2_team = <img src={player_2_path} className={"scoreboard_image"}/>
      var n = left.split(" ");  
      left= n[n.length - 1];
      n = right.split(" ");
      right = n[n.length - 1];
    }

    let heroes_played = ""
    let time_played = ""
    if(this.props.compare == "players"){
      heroes_played = 
              <Table.Row className={cell_css}>
                <Table.Cell />
                <Table.Cell width={4 + team_logo_width}>
                  <div className="Hero-container">
                    {hero_popups_by_player[0].map(function(hero,i){
                      return hero
                    })}
                  </div>
                </Table.Cell>
                <Table.Cell width={4}>
                  Heroes Played
                </Table.Cell>
                <Table.Cell  width={4 + team_logo_width}>
                  <div className="Hero-container">
                    {hero_popups_by_player[1].map(function(hero,i){
                      return hero
                    })}
                  </div>
                </Table.Cell>
                <Table.Cell />
              </Table.Row>
      time_played = 
            <Table.Row className={cell_css}>
                <Table.Cell />
                <Table.Cell width={4 + team_logo_width}>
                  {total_times[0]}
                </Table.Cell>
                <Table.Cell width={4}>
                  Total Time Played
                </Table.Cell>
                <Table.Cell  width={4 + team_logo_width}>
                  {total_times[1]}
                </Table.Cell>
                <Table.Cell />
              </Table.Row>
      }

      return(
        <Grid centered>
        <Grid.Row>
          <Grid.Column width={columnWidth}>
        <Table unstackable>
          <Table.Header>
            <Table.Row className={header_css}>
              <Table.HeaderCell width={team_logo_width}>
                {player_1_team}        
              </Table.HeaderCell>
              <Table.HeaderCell width={4}>
                {left}
              </Table.HeaderCell>
              <Table.HeaderCell width={4}>
                Stat
              </Table.HeaderCell>
              <Table.HeaderCell width={4}>
                {right}
              </Table.HeaderCell>
              <Table.HeaderCell width={team_logo_width}>
                {player_2_team}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {heroes_played}
            {time_played}
            {stats.map(function(stat,i){
              let seconds = game_length * 4
              let player_1_data = player_1[stat]
              let player_2_data = player_2[stat]
              let extra = ""
              let shortening = {
                "Hero Damage Done": "Damage",
                "Healing Done": "Healing",
                "Final Blows": "Kills",
                "Defensive Assists": "D. Assists",
                "Offensive Assists": "O. Assists"
              }
              if(stat in shortening){
                stat = shortening[stat]
              }
              if(stat_type == "per min"){
                player_1_data = Math.round(10 * player_1_data/player_minutes[0])/10

                player_2_data = Math.round(10 * player_2_data/player_minutes[1])/10
                extra = "/min"
              }
              if(stat_type == "per 10 min"){
                player_1_data = Math.round(100 * player_1_data/player_minutes[0])/10

                player_2_data = Math.round(100 * player_2_data/player_minutes[1])/10
                extra = "/10"
              }
              if (player_1_data == 0 && player_2_data == 0){
                return
              }
              let left_data = <Table.Cell className={cell_css}>{player_1_data}</Table.Cell>
              let right_data = <Table.Cell className={cell_css}>{player_2_data}</Table.Cell>
              if ((stat != "Deaths" && player_1_data > player_2_data) || (stat == "Deaths" && player_1_data < player_2_data )){
                left_data = <Table.Cell className={cell_css} positive>
                          <Icon name='checkmark' /> 
                          {player_1_data} 
                </Table.Cell>
              }

              if ((stat != "Deaths" && player_1_data < player_2_data) || (stat == "Deaths" && player_1_data > player_2_data )){
                right_data = 
                <Table.Cell className={cell_css} positive>
                  <Icon name='checkmark' />
                  {player_2_data} 
                </Table.Cell>
              }
              return(
                <Table.Row className={cell_css}>
                  <Table.Cell />
                    {left_data}
                  <Table.Cell >
                    {stat} 
                  </Table.Cell>
                    {right_data} 
                  <Table.Cell />
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
          </Grid.Column>
        </Grid.Row>
        </Grid>
      );
  }
}


export default Compare;
