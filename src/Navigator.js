import logo from './logo.svg';
import React, { Component } from 'react';

import './semantic-ui-css/semantic.min.css';
import {Header,Loader, Table,Button, Rating,Grid,Menu,Container,Image,List,Icon,Dropdown,Checkbox} from 'semantic-ui-react'
import './App.css';
import _ from 'lodash';


import * as firebase from "firebase";
import {databaseRef} from "./config/firebase.js"



class Navigator extends Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  onResize() {
    let mobile = false
    if(window.innerWidth < 500){
       mobile = true
    }
    this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120, mobile:mobile })
  }

  componentDidMount() {
    let stage = this.props.match.params.stage
    var that = this;
    if(!stage){
      stage = 1;
    }
    firebase.auth().onAuthStateChanged(function(user) {
      databaseRef.ref("stages/" + stage +  "/match_info").once("value").then(function(snapshot){
        let val = snapshot.val()
        that.setState({ data: val ,canary: "hi", stage: stage})
      })
    })
  }
  
  componentDidUpdate(prevProps){ 
      let stage = this.props.match.params.stage
      var that = this;
      if(!stage || stage == this.state.stage){
        return
      }
      if(this.state.canary == "hi"){
        this.setState({canary:null})
      }
      firebase.auth().onAuthStateChanged(function(user) {
      databaseRef.ref("stages/" + stage + "/match_info").once("value").then(function(snapshot){
        let val = snapshot.val()
        that.setState({ data: val ,canary: "hi", stage: stage})
      })
    })
  }



  render(){
    console.log('rerender?')
    let matches = []
    let json = {}
    let dropdown_content = []
    if(this.state.canary == null){
      return <Loader active inline='centered' />
    }
    for (let i = 0; i < 4; i++){
      let match_button = <Dropdown.Item>
        <Button as='a' href={'#/navigator/'+(i+1)}>{"Stage " + (i+1)}</Button>
        </Dropdown.Item>
      dropdown_content.push(match_button)
    }
    if(this.state.canary == "hi"){
      console.log(this.state.data)
      for(let match of this.state.data){
        matches.push(match)
      }
    }
    let stage = ""
    if(this.state.stage){
      stage = this.state.stage
    }
    return (
        <div>
          <Dropdown text = {"Stage " + this.state.stage} className={"Dropdown-padding"}>
              <Dropdown.Menu>
                 {dropdown_content.map(function(round,i){
                    return round
                 })};

              </Dropdown.Menu>
          </Dropdown>

        <Grid centered celled>
        {
          matches.map(function(match,i){
            let week = Math.floor(i/12)
            let home_image = "/images/" + match.home.team_name.replace(/ /g,"_") + ".svg"
            let away_image = "/images/" + match.away.team_name.replace(/ /g,"_") + ".svg"
            return (
              <Grid.Row>
                <Grid.Column width = {6} >
                  <Grid.Row>
                    Week {week}
                  </Grid.Row>

                </Grid.Column>
                <Grid.Column width = {5} >
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width = {12}>
                        {match.home.team_name}
                      </Grid.Column>
                      <Grid.Column width = {4}>
                        1
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width = {12}>
                        {match.away.team_name}
                      </Grid.Column >
                      <Grid.Column width = {4}>
                        0
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
                <Grid.Column width = {5} >
                  <Button as='a' href={'#/match/' + stage + '/'  + i}>Stats</Button>
                </Grid.Column>
              </Grid.Row>
            )
          })
        }

      </Grid>
      </div>
    
    );
  }

}

export default Navigator;
