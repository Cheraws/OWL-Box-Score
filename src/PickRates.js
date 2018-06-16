import React, { Component } from 'react';
import './App.css';
import Chart from "./Chart.js"
import Highcharts from 'highcharts';
import _ from 'lodash';
import {Header, Table,Button, Rating,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'
class PickRates extends Component {
    render(){
      let players = this.props.players
      let teams = this.props.teams
      let team_list = []
      let team_players = {}
      let game_length = players[Object.keys(players)[0]].game_length

      for(let team of teams){
        team_players[team.name] = {}
        team_list.push(team.name)
        team_players[team.name]["hero_pick"] = {}
      }
      
      //initialize dictionary.
      for(let player in players){
        let player_data = players[player].data[game_length-1]
        let player_team = players[player].team
        for(let hero in player_data["hero_pick"]){
          if(!(hero in team_players[player_team]["hero_pick"])){
            team_players[player_team]["hero_pick"][hero] = 0
          }
          team_players[player_team]["hero_pick"][hero] += player_data["hero_pick"][hero]
        }
      }

      let player_1 = team_players[team_list[0]]
      let player_2 = team_players[team_list[1]]
      let left = team_list[0]
      let right = team_list[1]
      let player_times = {}
      let match_length = 0
      for(let team of team_list){
        //player_times[team] = {}
        let player = team_players[team]
        let player_popups = []
        let player_heroes = _.sortBy(_.keys(player["hero_pick"]), function(hero){ return player["hero_pick"][hero]})
        let total_time = 0
        for(let hero of player_heroes.reverse()){
          let date = new Date(null);
          if(hero == "nohero"){
            continue
          }
          if(!(hero in player_times)){
            player_times[hero] = 0
          }
          player_times[hero] += player["hero_pick"][hero]
          total_time += player["hero_pick"][hero]
          /*
          let hero_path = "images/" + hero.replace(".","") + ".png"
          let hero_entry = <Popup
            key={hero_path}
            trigger={<img src={hero_path} className={hero_css}/>}
            header={hero}
            content={hero_time}
          />
          player_popups.push(hero_entry)*/
        }
        console.log(total_time)
        match_length += total_time
      }
      let series = []
      match_length = match_length/6
      let categories = []
      let times = [] 
      console.log(player_times)
      console.log(_.keys(player_times))
      let sorted_times = _.sortBy(_.keys(player_times), function(hero){ return player_times[hero]})
      console.log(sorted_times)
      for (let hero of sorted_times.reverse()){
        let hero_time = player_times[hero]/match_length
        series.push({name: hero, data: hero_time})
        times.push(hero_time)
        categories.push(hero)
      }
      let other_series = [ {name: "Pick Rates", data: times}      ]

      console.log(match_length)
      console.log(series)
      console.log(player_times)

      const pick_options = {
        title: {
          text: "Overall Pick rate",
        },
        chart: {
          type: 'column',
        },
        xAxis: {
          categories: categories
        },
        yAxis:{
          title: {

            text:"Pick Rate",
          },
          max: 1.0
          
        },
        plotOptions: {
          series: {
            marker: {
                enabled: false
            },
            colorByPoint: true,
          }
        },

        series: other_series,
      };




      return (
        <div>

          <Chart config={pick_options} />
        </div>
      );
           
  }
}

export default PickRates
