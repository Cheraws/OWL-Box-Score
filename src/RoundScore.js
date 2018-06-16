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
    let match_time = this.props.map.match_time
    let map_length = new Date(null);
    map_length.setSeconds(match_time);
    map_length = map_length.toISOString().substr(11, 8);
    let map_type = this.props.map_type
    let left_team = teams[0]
    let right_team = teams[1]
    let left_team_name =  left_team.name.split(" ");
    left_team_name = left_team_name[left_team_name.length - 1];
    let right_team_name =  right_team.name.split(" ");
    right_team_name = right_team_name[right_team_name.length - 1];
    let left_image = "/images/" + left_team.name.replace(/ /g,"_") + ".svg"
    let right_image = "/images/" + right_team.name.replace(/ /g,"_") + ".svg"
    let left_css = "score-text"
    let right_css = "score-text"
    if (left_team.score > right_team.score){
      left_css = "score-text bold"
    }
    if(left_team.score < right_team.score){
      right_css = "score-text bold"
    }
    return(
      <Grid padded>
        <Grid.Row>
          <Grid.Column>
            <div className = {"score-text"} >
              {map_type}
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
                {left_team.score}
              </div>
          </Grid.Column>
          <Grid.Column width={2} verticalAlign='center'>
              <div className = {"score-text"}>
                -
              </div>
          </Grid.Column>
          <Grid.Column width={3}  >
              <div className = {right_css}>
                {right_team.score}
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
