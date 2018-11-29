import React, { Component } from 'react';
import './App.css';
import Chart from "./Chart.js"
import Highcharts from 'highcharts';
import _ from 'lodash';
import {Header, Table,Button, Rating,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'
class PickRates extends Component {
  constructor(props){
    super(props)
    this.state = {team:"All"}
  }
  onTeamChange(team) {
    this.setState({team: team})       
  }


  AssignPlayers(team_data,team_names,filtered_teams) {

    let teams = {}
    let hero_times = {}
    let match_length = 0
    for (let team of team_names){
      if(filtered_teams != "All" && filtered_teams != team){
        continue
      }
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

            if(key == "time_played"){
              if( !(hero in hero_times)){
                hero_times[hero] = 0
              }   
              match_length += value
              hero_times[hero] += value
              player_entry["hero_pick"][hero] = value
            }
          }

        }
          player_team_data.push(player_entry)

      }
      teams[team] = (player_team_data)
    }
    return [hero_times,match_length]
   }


    render(){
      let teams = this.props.teams
      let team_names = this.props.team_names
      let team_list = []
      let team_players = {}
      let team_data = this.AssignPlayers(teams,team_names,this.state.team)
      let hero_times = team_data[0]
      let match_length = team_data[1]


      
      let player_times = {}
 
      let series = []
      match_length = match_length/6
      let categories = []
      let times = [] 

      let sorted_times = _.sortBy(_.keys(hero_times), function(hero){ return hero_times[hero]})
      for (let hero of sorted_times.reverse()){
        let hero_time = hero_times[hero]/match_length * 100
        series.push({name: hero, data: hero_time})
        times.push(hero_time)
        categories.push(hero)
      }
      let team_content = []

      let  team_indicator = <Dropdown.Item 
            onClick={()=> this.onTeamChange("All")}
          >
          {"All"} </Dropdown.Item>
      team_content.push(team_indicator)

      for(let team in teams){
        team_indicator = <Dropdown.Item 
            onClick={()=> this.onTeamChange(team)}
          >
          {team} </Dropdown.Item>
        team_content.push(team_indicator)
      }

      let other_series = [ {name: "Pick Rates", data: times}      ]


      const pick_options = {
        title: {
          text: "Overall Pick Rate",
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
          labels: {
          formatter: function() {
          return this.value+"%";
            }
          }
          
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
            <Dropdown text = {this.state.team}  selection>
              <Dropdown.Menu>
                 {team_content.map(function(stat,i){
                    return stat
                 })}
              </Dropdown.Menu>
            </Dropdown>
          <Chart config={pick_options} />
        </div>
      );
           
  }
}

export default PickRates
