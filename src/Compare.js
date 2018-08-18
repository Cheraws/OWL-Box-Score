import logo from './logo.svg';
import React, { Component } from 'react';

import './semantic-ui-css/semantic.min.css';
import {Header,Checkbox,Table,Button, Rating,Popup, Grid,Menu,Container,Image,List,Icon,Dropdown} from 'semantic-ui-react'
import './App.css';
import _ from 'lodash';
import character_stats from './hero_stats.json'
import players from './players.json'




class Compare extends Component {
  
  constructor(props){
    super(props)
    this.AssignPlayers = this.AssignPlayers.bind(this)
    this.PlayerStats = this.PlayerStats.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {left_hero: "all", right_hero:"all"}
  }


  onChange(left,right) {
    this.setState({ left_hero: left, right_hero:right})       
  }

  static getDerivedStateFromProps(nextProps, prevState){
    //Makes sure if left or right hero still in object.
    let left = nextProps.left
    let right = nextProps.right
    let player_1,player_2
    let teams = nextProps.teams
    for(let team in nextProps.teams){
      if(left in teams[team]['players']){
        player_1 = {
          "name": left,
          "data": teams[team]['players'][left],
          "team":team
        }
      }
      if(right in teams[team]['players']){

        player_2 = {
          "name": right,
          "data": teams[team]['players'][right],
          "team":team
        }
      }
    }
    let left_hero = prevState.left_hero
    let right_hero = prevState.right_hero
    if((!(left_hero in player_1.data))){
      left_hero = "all"
    }
    if(!(right_hero in player_2.data)){
      right_hero = "all"
    }
    return {left_hero: left_hero, right_hero:right_hero}
  }


  AssignPlayers(left_player, right_player){
    let players = [left_player,right_player]
    let filtered_players = []
    let keys = []
    for (let player of players){
      let shown_keys = ["final_blows", "eliminations", "hero_damage", "deaths", "healing"]
      let player_entry = {}
      player_entry["all"] = {}

      player_entry["all"]["hero_pick"] = {}
      let player_data = player.data
      player_entry["name"] = player.name 
      player_entry["team"] = player.team
      player_entry["hero_pick"] = {}

      player_entry["all"]["hero"] = "all"
      for (let hero in player_data){
        player_entry[hero] = {}

        player_entry[hero]["hero_pick"] = {}
        for (let key in player_data[hero]){
          if(!keys.includes(key)){
            keys.push(key)
          }
          let value = player_data[hero][key]
          if (typeof value == 'number'){
            if (!(key in player_entry["all"])){
              player_entry["all"][key] = 0
            }
            player_entry["all"][key] += Math.trunc(value)
            player_entry[hero][key] = Math.trunc(value)
          }
          if(key == "time_played"){
            player_entry["all"]["hero_pick"][hero] = value
            player_entry["hero_pick"][hero] = value
            player_entry[hero]["hero_pick"][hero] = value
          }
        }
        
      }
      for(let key of shown_keys){
        if(!(key in player_entry)){ 
          player_entry[key] = 0
        }
      }
      filtered_players.push(player_entry)

    }
    let dictionary = {
      players:filtered_players,
      keys: keys
    }
    return dictionary
  }



  //Organizes the stats based on the statline shown.
  PlayerStats(title,player_1,player_2,stat_list,stat_type,cell_css,player_minutes){
      return(

        <React.Fragment>
          <Table.Row className={cell_css}>
            <Table.HeaderCell width={6}>
            </Table.HeaderCell>
            <Table.HeaderCell width={4}>
              {title} Stats
            </Table.HeaderCell>
            <Table.HeaderCell width={6}>
            </Table.HeaderCell>
          </Table.Row>
          {stat_list.map(function(stat,i){
              if(stat == "objective_time" || stat == "time_played"){
                return
              }
              let player_1_data = player_1[stat]
              let player_2_data = player_2[stat]
              if (player_1_data == null){
                player_1_data = 0
              }
               if (player_2_data == null){
                player_2_data = 0
              }
              let extra = ""
              let formatted_stat = _.startCase(_.replace(stat, /_/g, " "))

              if(stat_type == "per min" && stat != "Weapon Accuracy"){
                player_1_data = Math.round(10 * player_1_data/player_minutes[0])/10

                player_2_data = Math.round(10 * player_2_data/player_minutes[1])/10
                extra = "/min"
              }
              if(stat_type == "per 10 min" && stat != "Weapon Accuracy"){
                player_1_data = Math.round(100 * player_1_data/player_minutes[0])/10

                player_2_data = Math.round(100 * player_2_data/player_minutes[1])/10
                extra = "/10"
              }
              if (player_1_data == 0 && player_2_data == 0){
                return
              }
              let left_data = <Table.Cell className={cell_css}>{player_1_data}</Table.Cell>
              let right_data = <Table.Cell className={cell_css}>{player_2_data}</Table.Cell>
              if ((player_1_data > player_2_data) ){
                left_data = <Table.Cell className={cell_css} positive>
                          <Icon name='checkmark' /> 
                          {player_1_data} 
                </Table.Cell>
              }

              if (player_1_data < player_2_data) {
                right_data = 
                <Table.Cell className={cell_css} positive>
                  <Icon name='checkmark' />
                  {player_2_data} 
                </Table.Cell>
              }

              return(
                <Table.Row className={cell_css}>
                    {left_data}
                  <Table.Cell >
                    {formatted_stat} 
                  </Table.Cell>
                    {right_data} 
                </Table.Row>
              );
            })}

        </React.Fragment>

      );



  }

  render() {
    let players = this.props.players
    let teams = this.props.teams
    let stats  = ["final_blows", "eliminations", "hero_damage", "deaths", "healing"]
    let stat_type = this.props.stat_type
    let left = this.props.left
    let right = this.props.right
    let player_1 = null
    let player_2 = null
    for(let team in teams){
      if(left in teams[team]['players']){
        player_1 = {
          "name": left,
          "data": teams[team]['players'][left],
          "team":team
        }
      }
      if(right in teams[team]['players']){

        player_2 = {
          "name": right,
          "data": teams[team]['players'][right],
          "team":team
        }
      }
    }
    let dictionary  = this.AssignPlayers(player_1, player_2)
    let filtered_players = dictionary["players"]
    let keys = dictionary["keys"]
    let left_dropdown = []
    let right_dropdown = []
    let left_characters_played = _.concat(["all"],Object.keys(player_1.data))
    let right_characters_played = _.concat(["all"],Object.keys(player_2.data))


    // Initializing dropdowns of characters.
    for(let hero of left_characters_played){
      let match_button = <Dropdown.Item 
          onClick={()=> this.onChange(hero, this.state.right_hero)}
        >
        {hero}
      </Dropdown.Item>
      left_dropdown.push(match_button)
    }

    for(let hero of right_characters_played){
      let match_button = <Dropdown.Item 
          onClick={()=> this.onChange( this.state.left_hero, hero)}
        >
        {hero}
      </Dropdown.Item>
      right_dropdown.push(match_button)
    }

    player_1 = filtered_players[0][this.state.left_hero]
    player_2 = filtered_players[1][this.state.right_hero]

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
        if (hero == ""){
          continue
        }
        let date = new Date(null);
        date.setSeconds(player["hero_pick"][hero]);
        total_time += player["hero_pick"][hero]
        let hero_time = date.toISOString().substr(11, 8);
        let hero_path = "/images/" + hero.replace(".","") + ".png"
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
    let left_stats,right_stats,shared_stats,different_stats
    let all_stats = this.PlayerStats("Generic",player_1,player_2,character_stats["all"],stat_type,cell_css,player_minutes)
    let shared_stat_names = _.intersection(character_stats[this.state.left_hero], character_stats[this.state.right_hero])

    let left_stat_names = _.difference(character_stats[this.state.left_hero], character_stats[this.state.right_hero])
    let right_stat_names = _.difference(character_stats[this.state.right_hero], character_stats[this.state.left_hero])
    if(this.state.left_hero != "all" && this.state.right_hero != "all"){
      shared_stats = this.PlayerStats("Shared",player_1,player_2,shared_stat_names,stat_type,cell_css,player_minutes)
    }

    if(this.state.left_hero != this.state.right_hero){
      if(this.state.left_hero != "all"){
        left_stats = this.PlayerStats(this.state.left_hero,player_1,player_2,left_stat_names,stat_type,cell_css,player_minutes)
      }
      if(this.state.right_hero != "all"){
        right_stats = this.PlayerStats(this.state.right_hero,player_1,player_2,right_stat_names,stat_type,cell_css,player_minutes)
      }
    }
    let heroes_played = ""
    let time_played = ""
    let heroes = ""
    if(this.props.compare == "players"){
      heroes = 
            <Table.Row className={cell_css}>
                <Table.Cell width={4 + team_logo_width} text={this.state.left_hero}>
                 <Dropdown text={this.state.left_hero}>
                    <Dropdown.Menu >
                      {left_dropdown.map(function(stat,i){
                          return stat
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                </Table.Cell>
                <Table.Cell width={4}>
                  Heroes
                </Table.Cell>
                <Table.Cell  width={4 + team_logo_width} >
                 <Dropdown text = {this.state.right_hero}>
                    <Dropdown.Menu  >
                      {right_dropdown.map(function(stat,i){
                          return stat
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                </Table.Cell>
              </Table.Row>

      heroes_played = 
              <Table.Row className={cell_css}>
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
              </Table.Row>
      time_played = 
            <Table.Row className={cell_css}>
                <Table.Cell width={4 + team_logo_width}>
                  {total_times[0]}
                </Table.Cell>
                <Table.Cell width={4}>
                  Total Time Played
                </Table.Cell>
                <Table.Cell  width={4 + team_logo_width}>
                  {total_times[1]}
                </Table.Cell>
              </Table.Row>
      }

      return(
        <Grid centered>
        <Grid.Row>
          <Grid.Column width={columnWidth}>
        <Table unstackable>
          <Table.Header>
            <Table.Row className={header_css}>
              <Table.HeaderCell width={6}>
                {left}
              </Table.HeaderCell>
              <Table.HeaderCell width={4}>
                Stat
              </Table.HeaderCell>
              <Table.HeaderCell width={6}>
                {right}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {heroes}
            {heroes_played}
            {time_played}
            {all_stats}
            {shared_stats}
            {left_stats}
            {right_stats}
          </Table.Body>
        </Table>
          </Grid.Column>
        </Grid.Row>
        </Grid>
      );
  }
}


export default Compare;
