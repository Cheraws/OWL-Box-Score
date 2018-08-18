import React, { Component } from 'react';
import logo from './logo.svg';
import './semantic-ui-css/semantic.min.css';
import {Header, Table,Button, Rating,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'
import './App.css';
import LineGraph from './LineGraph.js'
import Scoreboard from './Scoreboard.js'
import Compare from './Compare.js'

class MatchScore extends Component{
  render(){
    let teams = this.props.teams
    let game = this.props.game
    let scores = [[], []]
    let games_won = [0,0]
    let map_types = []
    for(let i = 0; i< game.length; i++){
      let teams = game[i].teams
      let map_type = game[i].map_type
      map_types.push(map_type)
      for(let i = 0; i < teams.length; i++){
        let team = teams[i]
        let score = team.score
        if(typeof score == "string"){
          score = parseInt(score)
        }
        scores[i].push(score)
      }
      if (scores[0][i] > scores[1][i]){
        games_won[0] += 1
      }
      if (scores[1][i] > scores[0][i]){
        games_won[1] += 1
      }
    }
    console.log(games_won)
    let left_team = game[0].teams[0]
    let right_team = game[0].teams[1]
    let left_team_name =  left_team.name.split(" ");
    left_team_name = left_team_name[left_team_name.length - 1];
    let right_team_name =  right_team.name.split(" ");
    right_team_name = right_team_name[right_team_name.length - 1];
    let left_image = "/images/" + left_team.name.replace(/ /g,"_") + ".svg"
    let right_image = "/images/" + right_team.name.replace(/ /g,"_") + ".svg"
    let left_css = "score-text"
    let right_css = "score-text"
    if (games_won[0] > games_won[1]){
      left_css = "score-text bold"
    }
    if(games_won[0] < games_won[1]){
      right_css = "score-text bold"
    }
    let table_width = 8
    console.log(scores)
    if(this.props.mobile == true){
      table_width = 16
      for(let i = 0; i < game.length; i++){
        map_types[i] = "R" + (i+1)
      }
        
    }
    return(
      <Grid className={"round-tabs"}>
        <Grid.Row>
          <Grid.Column width={16}>
            <div class={"score-text"}>
              {"Match Stats"}
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>  
          <Grid.Column width={4}>
            <img src={left_image} className={"score_image"}/>
          </Grid.Column>
          <Grid.Column width={3}>
              <div className = {left_css}>
                {games_won[0]}
              </div>
          </Grid.Column>
          <Grid.Column width={2} verticalAlign='center'>
              <div className = {"score-text"}>
                -
              </div>
          </Grid.Column>
          <Grid.Column width={3}  >
              <div className = {right_css}>
                {games_won[1]}
              </div>
          </Grid.Column>
          <Grid.Column width={4}>
            <img src={right_image} className={"score_image"}/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
        <Grid.Column width = {(16 - table_width)/2}/>
        <Grid.Column width = {table_width}>
          <Table unstackable centered>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                {map_types.map(function(map_type,i){
                  return <Table.HeaderCell>{map_type}</Table.HeaderCell>
                })}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell width={2}>
                  <img src={left_image} className={"score_image"}/>
                </Table.Cell>

                {scores[0].map(function(score,i){
                  if (score > scores[1][i]){
                    return <Table.Cell positive>
                              <Icon name='checkmark' /> 
                              {score} 
                          </Table.Cell>
                  }
                  return <Table.Cell >{score}</Table.Cell>
                })}
              </Table.Row>
              <Table.Row>
                <Table.Cell width={2}>
                  <img src={right_image} className={"score_image"}/>
                </Table.Cell>
                {scores[1].map(function(score,i){
                  if (score > scores[0][i]){
                    return <Table.Cell positive>
                              <Icon name='checkmark' /> 
                              {score} 
                          </Table.Cell>
                  }
                  return <Table.Cell >{score}</Table.Cell>
                })}
              </Table.Row>
            </Table.Body>
            </Table>
          </Grid.Column>

          <Grid.Column width = {(16 - table_width)/2}/>
        </Grid.Row>
        <Grid.Row />
      </Grid>

    );
  }
}

export default MatchScore
