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
    let data = this.props.data
    let team_names = this.props.team_names
    let match = data['match']
    let scores = [[], []]
    let games_won = [0,0]
    let map_names = []
    let week = Math.floor(data['week'])
    let day = Math.floor(data['day'])
    let title = "Week " + week + " Day " + day
    for(let i = 0; i< 5; i++){
      if(!(match[i])){
        continue
      }
      let teams = match[i].teams
      let map_name = match[i]['map_name']
      map_name = map_name.replace("-", " ")
      map_name = map_name.replace(/\b\w/g, function(l){ return l.toUpperCase() })
      let count = 0
      let current_score = []
      for(let team of team_names){
        let score = teams[team]['score']
        if(typeof score == "string"){
          score = parseInt(score)
        }
        scores[count].push(score)
        count += 1
        current_score.push(score)
      }
      if (current_score[0]> current_score[1]){
        games_won[0] += 1
      }
      if (current_score[0] < current_score[1]){
        games_won[1] += 1
      }
      map_names.push(map_name)
    }
    let left_team = team_names[0]
    let right_team = team_names[1]

    let left_image = "/images/" + left_team.replace(/ /g,"_") + ".svg"
    let right_image = "/images/" + right_team.replace(/ /g,"_") + ".svg"
    let left_css = "score-text"
    let right_css = "score-text"
    if (games_won[0] > games_won[1]){
      left_css = "score-text bold"
    }
    if(games_won[0] < games_won[1]){
      right_css = "score-text bold"
    }
    let table_width = 8
    

    //Desktop Version
    let table = <Grid.Row>
  <Grid.Column width = {(16 - table_width)/2}/>

      <Grid.Column width = {table_width}>
          <Table unstackable centered>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                {map_names.map(function(map_type,i){
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


    if(this.props.mobile == true){
      table_width = 16
      table = <Grid.Row>
        <Grid.Column width = {16} >
        <Table unstackable centered>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell  width={4}>  </Table.HeaderCell>
              <Table.HeaderCell  width={8} textAlign={"center"}> Map </Table.HeaderCell>
              <Table.HeaderCell  width={4}>  </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {scores[0].map(function(score,i){
              return <Table.Row>
                  
                  <Table.Cell> {scores[0][i]} </Table.Cell>
                  <Table.Cell textAlign={"center"}> {map_names[i]} </Table.Cell>
                  <Table.Cell textAlign={"right"}> {scores[1][i]} </Table.Cell>

                </Table.Row>

            })}
            </Table.Body>
          </Table>
        </Grid.Column>
        </Grid.Row>
        
    }

    return(
      <Grid className={"round-tabs"}>
        <Grid.Row>
          <Grid.Column width={16}>
            <div class={"score-text"}>
              {title}
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
        {table}
        <Grid.Row />
      </Grid>

    );
  }
}

export default MatchScore
