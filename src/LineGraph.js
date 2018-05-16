import React, { Component } from 'react';
import './App.css';
import Chart from "./Chart.js"
import Highcharts from 'highcharts';

import {Header, Table,Button, Rating,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'
class LineGraph extends Component {

    constructor(props){
      super(props)
      this.state = {stat: "Eliminations" }
      this.onStats = this.onStats.bind(this)
    }
    onStats(d) {
      this.setState({ stat: d})       
    }
    render(){
      let players = this.props.players
      let stats  = ['Hero Damage Done', 'Healing Done', 'Solo Kills', 'Best Kill Streak', 'Deaths', 'Final Blows',     'Defensive Assists', 'Offensive Assists', 'Eliminations',  'Objective Kills','Assists']
      let current_stat = this.state.stat
      let dropdown_options = []
      let player_1_data = []
      let player_2_data = []
      let dates = []
      let dates_by_minute = []
      let series = []
      let series_by_minute = []
      let first = true
      let game_length = 0
      let team_stats = {}
      for(let i = 0; i< stats.length; i++){
        let stat = stats[i]
        let match_button = <Dropdown.Item onClick={()=> this.onStats(stat)}>{stat}</Dropdown.Item>
        dropdown_options.push(match_button)
      }
      for(let player in players){
        let player_data = players[player]
        let team = player_data.team
        game_length = player_data.game_length
        let player_graph_info = {name: player, data: []}

        let player_graph_by_minute_info = {name: player, data: []}
        for(let i = 0; i < game_length; i++){
          let number = player_data.data[i][current_stat]

          if (!(team in team_stats)){
            team_stats[team] = []
          }
          if(i >= team_stats[team].length){
            team_stats[team].push(number)
          } 
          else{
            team_stats[team][i] += number
          }
          if(first){
            dates.push(i*4000)
          }

          player_graph_info.data.push(number)
        }
        first = false
        series.push(player_graph_info)
      }

      let team_series_by_minute = []
      let minutes = []
      for(let team in team_stats){
        minutes = []
        let team_stats_by_minute = []
        for(let i = 0; i < dates.length; i += 15){
          team_stats_by_minute.push(team_stats[team][Math.min(i+15, dates.length-1)] - team_stats[team][i])
          minutes.push(i*4000)
        }
        team_series_by_minute.push({name:team, data: team_stats_by_minute})
      }

      let team_series = []
      for(let team in team_stats){
        team_series.push({name:team, data:team_stats[team]})
      }

      const options = {
        title: {
          text: "Player Stats",
        },
        chart: {
          type: 'line',
        },
        yAxis:{
          title: {
            text:current_stat,
          }
        },
        plotOptions: {
          series: {
            marker: {
                enabled: false
            }
          }
        },
        tooltip:{
            xDateFormat: '%H:%M:%S',
            shared: true,
        },
        xAxis:{
          title: {
            text:'Time',
          },
          type: 'datetime',
          labels: {
            formatter: function() {
              return Highcharts.dateFormat('%H:%M:%S', this.value);
            }
          },
          tickInterval: game_length/10,
          categories: dates
        },
        series: series,
      };

      const team_options = {
        title: {
          text: "Team Stats",
        },
        chart: {
          type: 'line',
        },
        yAxis:{
          title: {

            text:current_stat,
          }
        },
        tooltip:{
          xDateFormat: '%H:%M:%S',
            shared: true,
        },
        plotOptions: {
          series: {
            marker: {
                enabled: false
            }
          }
        },
        xAxis:{
          type: 'datetime',
          title: {
            text:'Time',
          },
          labels: {
            formatter: function() {
              return Highcharts.dateFormat('%H:%M:%S', this.value);
            },
          },
          tickInterval: game_length/10,
          categories: dates
        },
        series: team_series,
      };

      const team_options_by_minute = {
        title: {
          text: "Team Stats Per Minute",
        },
        chart: {
          type: 'column',
        },
        yAxis:{
          title: {

            text:current_stat,
          }
        },

        tooltip:{
          xDateFormat: '%H:%M:%S',
            shared: true,
        },

        plotOptions: {
          series: {
            marker: {
                enabled: false
            }
          }
        },
        xAxis:{
          type: 'datetime',
          title: {
            text:'Time',
          },
          labels: {
            formatter: function() {
              return Highcharts.dateFormat('%H:%M:%S', this.value);
            },
          },
          categories: minutes
        },
        series: team_series_by_minute,
      };




      return (
        <div>

          <Dropdown text = {current_stat}>
            <Dropdown.Menu>
               {dropdown_options.map(function(stat,i){
                  return stat
               })};
            </Dropdown.Menu>
          </Dropdown>
          <Chart config={team_options} />
          <Chart config={team_options_by_minute} />
          <Chart config={options} />
        </div>
      );
           
  }
}

export default LineGraph
