import React, { Component } from 'react';
import logo from './logo.svg';
import './semantic-ui-css/semantic.min.css';
import {Header, Table,Button, Rating,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'
import './App.css';
import LineGraph from './LineGraph.js'
import Scoreboard from './Scoreboard.js'
import Compare from './Compare.js'

class RoundScore extends Component{
  render(){
    let teams = this.props.teams
    let team_names =this.props.team_names

    let match_time = 0
    //calculate match time.
    for (let team of team_names){
      let team_data = teams
      let player_team_data = []
      let player_entry = {}
      for (let player in team_data[team]['players']){
        let player_entry = {}
        let player_data = team_data[team]['players'][player]
        for (let hero in player_data){
          for (let key in player_data[hero]){
            let value = player_data[hero][key]

            if(key == "time_played"){
              match_time += value
            }
          }

        }
      }
    }
    match_time = match_time/12
    let map_length = new Date(null);
    map_length.setSeconds(match_time);
    map_length = map_length.toISOString().substr(11, 8);
    let map_name = this.props.map_name
    map_name = map_name.replace("-", " ")
    map_name = map_name.replace(/\b\w/g, function(l){ return l.toUpperCase() })
    let left_team = team_names[0]
    let right_team = team_names[1]
    let left_image = "/images/" + left_team.replace(/ /g,"_") + ".svg"
    let right_image = "/images/" + right_team.replace(/ /g,"_") + ".svg"
    let left_css = "score-text"
    let right_css = "score-text"
    if (teams[left_team].score > teams[right_team].score){
      left_css = "score-text bold"
    }
    if(teams[left_team].score < teams[right_team].score){
      right_css = "score-text bold"
    }
    return(
      <Grid padded>
        <Grid.Row>
          <Grid.Column>
            <div className = {"score-text"} >
              {map_name}
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <div >
              {"Map Length:" + map_length}
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>  
          <Grid.Column width={4}>
            <img src={left_image} className={"score_image"}/>
          </Grid.Column>
          <Grid.Column width={3}>
              <div className = {left_css}>
                {teams[left_team].score}
              </div>
          </Grid.Column>
          <Grid.Column width={2} verticalAlign='center'>
              <div className = {"score-text"}>
                -
              </div>
          </Grid.Column>
          <Grid.Column width={3}  >
              <div className = {right_css}>
                {teams[right_team].score}
              </div>
          </Grid.Column>
          <Grid.Column width={4}>
            <img src={right_image} className={"score_image"}/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row />
      </Grid>

    );
  }
}

export default RoundScore
