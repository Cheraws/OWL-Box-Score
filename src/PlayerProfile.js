import logo from './logo.svg';
import React, { Component } from 'react';

import './semantic-ui-css/semantic.min.css';
import {Header,Loader, Table,Button, Rating,Grid,Menu,Container,Image,List,Icon,Dropdown,Checkbox} from 'semantic-ui-react'
import './App.css';
import _ from 'lodash';


import * as firebase from "firebase";
import {databaseRef} from "./config/firebase.js"



class PlayerProfile extends Component {
  constructor(props){
    super(props)
    this.state = {}

    this.onChange = this.onChange.bind(this)
  }

  onResize() {
    let mobile = false
    if(window.innerWidth < 500){
       mobile = true
    }

    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120, mobile:mobile })
  }

  componentDidMount() {
    let player = this.props.match.params.player
    var that = this;
    firebase.auth().onAuthStateChanged(function(user) {
      databaseRef.ref("players/" + player).once("value").then(function(snapshot){
        let val = snapshot.val()
        that.setState({ data: val ,canary: "hi", player: player})
      })
    })

  }
  
  onChange(hero) {
    this.setState({hero: hero})
  }

  componentDidUpdate(prevProps){ 
      let player  = this.props.match.params.player
      var that = this;
      if(!player || player == this.state.player){
        return
      }
      if(this.state.canary == "hi"){
        this.setState({canary:null})
      }

    firebase.auth().onAuthStateChanged(function(user) {
      databaseRef.ref("players/" + player).once("value").then(function(snapshot){
        let val = snapshot.val()
        that.setState({ data: val ,canary: "hi", player: player})
      })
    })
  }



  render(){
    let matches = []
    let json = {}
    let dropdown_content = []
    if(this.state.canary == null){
      return <Loader active inline='centered' />
    }
    let player = this.state.player
    let playtimes = []
    let total_playtime = 0
    let total_players = 0
    let statline = []
    let hero_data = this.state.data
    let current_hero = this.state.hero
    if(this.state.canary == "hi" && this.state.data){

      for(let hero in this.state.data){
        if(!current_hero){
          current_hero = hero
        }
          let match_button = <Dropdown.Item
            onClick={()=> this.onChange(hero)}
          > {hero}
        </Dropdown.Item>
      dropdown_content.push(match_button)
        console.log(hero)
        let hero_info = this.state.data[hero]
        hero_info["name"] = hero
        statline = hero_info
        matches.push(hero_info)
      let time_played = hero_info['raw']['time_played']
      total_players = hero_info['total']
      total_playtime += time_played
        playtimes.push({
          "hero": hero,
          "time_played": time_played
        
        })
      }
      console.log(this.state.data[current_hero])
      statline = Object.keys(this.state.data[current_hero]["per_10"])
      console.log(statline)
    }
      
    playtimes  = _.sortBy(playtimes, ["time_played"]).reverse()
    let stage = ""
    if(this.state.stage){
      stage = this.state.stage
    }
    return (
      <Grid centered>
        <Grid.Row>
          <h1> {this.state.player} Profile</h1>
        </Grid.Row>
        <Grid.Row>
        <Grid.Column width = {16}>
        <h3> Playtime By Hero</h3>
        <Grid centered celled>
              <Grid.Row>
                <Grid.Column width = {6} >
                  <Grid.Row>
                    Hero 
                  </Grid.Row>
                </Grid.Column>                   
                <Grid.Column width = {5} >
                  Playtime
                </Grid.Column>
                <Grid.Column width = {5} >
                  Played %
                </Grid.Column>
              </Grid.Row>
        {
          playtimes.map(function(hero,i){
            let date = new Date(null)
            date.setSeconds(hero.time_played); // specify value for SECONDS here
            let timeString = date.toISOString().substr(11, 8);
            let hours = Math.floor(hero.time_played/(3600))
            timeString = timeString.replace(/^.{2}/g, hours);
            let percentage = Math.floor((hero.time_played/total_playtime) * 1000)/10
            return (
              <Grid.Row>
                <Grid.Column width = {6} >
                  <Grid.Row>
                    {hero.hero}
                  </Grid.Row>
                </Grid.Column>                   
                <Grid.Column width = {5} >
                  {timeString}
                </Grid.Column>
                <Grid.Column width = {5} >
                  {percentage}%
                </Grid.Column>
              </Grid.Row>
            )
          })
        }
        </Grid>
        </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Dropdown text = {current_hero}  selection>
            <Dropdown.Menu>
               {dropdown_content.map(function(player,i){
                  return player
               })}
            </Dropdown.Menu>
          </Dropdown>
        </Grid.Row>
        <Grid.Row>
        <Grid.Column width = {16}>
        <Grid centered celled>
              <Grid.Row>
                <Grid.Column width = {6} >
                  <Grid.Row>
                    Stat
                  </Grid.Row>
                </Grid.Column>
                <Grid.Column width = {5} >
                  Stat per 10
                </Grid.Column>
                <Grid.Column width = {5} >
                  Rank
                </Grid.Column>
              </Grid.Row>
        {
          statline.map(function(stat,i){
            let per_10 = Number(hero_data[current_hero]["per_10"][stat]).toFixed(2)
            let clean_stat = stat.replace(/_/g, " ");
            let rank = hero_data[current_hero]["rank"][stat]
            return (
              <Grid.Row>
                <Grid.Column width = {6} >
                  <Grid.Row>
                    {clean_stat}
                  </Grid.Row>
                </Grid.Column>
                <Grid.Column width = {5} >
                  {per_10}
                </Grid.Column>
                <Grid.Column width = {5} >
                  {rank}/{total_players}
                </Grid.Column>
              </Grid.Row>
            )
          })
        }
        </Grid>
        </Grid.Column>
        </Grid.Row>

      </Grid>
    
    );
  }

}

export default PlayerProfile;
