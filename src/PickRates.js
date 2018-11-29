import React, { Component } from 'react';
import './App.css';
import Chart from "./Chart.js"
import Highcharts from 'highcharts';
import _ from 'lodash';
import {Header, Table,Button, Rating,Grid,Menu,Container,Image,List,Icon,Dropdown,Tab} from 'semantic-ui-react'

class PickRates extends Component {
  constructor(props){
    super(props)
    this.state = {filter:"All"}
  }
  onFilterChange(team) {
    this.setState({filter: team, additional: ""})       
  }
  onSecondChange(type) {
    this.setState({additional: type})       
  }



  AssignPlayers(team_data,team_names,filter,addition) {

    let teams = {}
    let hero_times = {}
    let match_length = 0
    for (let team of team_names){
      if(filter == "Team" && team != addition){
        continue
      }
      let shown_keys = ["final_blows", "eliminations", "hero_damage", "deaths", "healing"]
      let player_team_data = []
      let player_entry = {}
      for (let player in team_data[team]['players']){
        if(filter == "Player" && player != addition){
          continue
        }
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
      let hero_color = {
        "ana": "718ab3" ,
        "bastion":"7c8f7b"  ,
        "brigitte":"be736e"  ,
        "dva":"ed93c7"  ,
        "doomfist":"815049"  ,
        "genji":"97ef43"  ,
        "hanzo":"b9b48a"  ,
        "junkrat":"ecbd53"  ,
        "lucio":"85c952"  ,
        "mccree":"ae595c"  ,
        "mei":"6faced"  ,
        "mercy":"ebe8bb"  ,
        "moira":"803c51"  ,
        "orisa":"468c43"  ,
        "pharah":"3e7dca"  ,
        "reaper":"7d3e51"  ,
        "reinhardt":"929da3"  ,
        "roadhog":"b68c52"  ,
        "soldier":"697794"  ,
        "sombra":"7359ba"  ,
        "symmetra":"8ebccc"  ,
        "torbjorn":"c0726e"  ,
        "tracer":"d79342"  ,
        "widowmaker":"9e6aa8"  ,
        "winston":"a2a6bf"  ,
        "zarya":"e77eb6"  ,
        "zenyatta":"ede582"
      }
      let teams = this.props.teams
      let team_names = this.props.team_names
      let team_list = []
      let team_players = {}
      let filter_content = []
      let team_content = []
      let player_content = []
      let player_names = []

      //Filter Type
      for(let type of ["All", "Team", "Player"]){
        let filter_indicator = <Dropdown.Item 
            onClick={()=> this.onFilterChange(type)}
          >
          {type} </Dropdown.Item>
        filter_content.push(filter_indicator)
      }


      for(let team in teams){
        let team_indicator = <Dropdown.Item 
            onClick={()=> this.onSecondChange(team)}
          >
          {team} </Dropdown.Item>
        team_content.push(team_indicator)
        for (let player in teams[team]['players']){
          player_names.push(player)
          let player_indicator = <Dropdown.Item 
            onClick={()=> this.onSecondChange(player)}
          >
          {player} </Dropdown.Item>
          player_content.push(player_indicator)

        }

      }

      let additional_filter = {"All": [], "Team":team_content , "Player":player_content}
      additional_filter = additional_filter[this.state.filter]

      let additional_filter_names = {"All": [], "Team":team_names , "Player":player_names}

      let filter_modifier  = {"All": 6, "Team":6 , "Player":1}
      additional_filter_names = additional_filter_names[this.state.filter]
      let additional = this.state.additional

      if(additional == "" && additional_filter.length > 0){
        for(let second of additional_filter_names){
          additional = second
          break
        }
      }
      console.log(additional)
      //Getting The hero times.
      let team_data = this.AssignPlayers(teams,team_names,this.state.filter, additional)
      let hero_times = team_data[0]
      let match_length = team_data[1]


      
      let player_times = {}
 
      let series = []
      match_length = match_length/filter_modifier[this.state.filter]
      let categories = []
      let times = [] 
      let colors = []
      let sorted_times = _.sortBy(_.keys(hero_times), function(hero){ return hero_times[hero]})
      for (let hero of sorted_times.reverse()){
        let hero_time = Math.round(hero_times[hero]/match_length * 100)
        series.push({name: hero, data: hero_time, color: '#' + hero_color[hero]})
        colors.push('#' + hero_color[hero])
        times.push(hero_time)
        categories.push(hero)
      }


      let other_series = [ {name: "Pick Rates", data: times} ]     
      console.log(this.state.filter)
      console.log(additional_filter)


      const pick_options = {
        title: {
          text: "Overall Pick Rate",
        },
        chart: {
          type: 'bar',
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
          },
          
        },
        plotOptions: {
          bar: {
            dataLabels: {
                enabled: true
            }
          },
          series: {
            pointPadding: 0.002,
            colorByPoint: true,
            colors: colors,
            marker: {
                enabled: false
            },
          },
        },

        series: other_series,
      };




      return (
        <div>
            Filter By: <Dropdown text = {this.state.filter}  selection>
              <Dropdown.Menu>
                 {filter_content.map(function(stat,i){
                    return stat
                 })}
              </Dropdown.Menu>
            </Dropdown>
            Additional Filter: <Dropdown text = {additional}  selection>
              <Dropdown.Menu>
                 {additional_filter.map(function(stat,i){
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
