import moment from 'moment';
import React, { Component } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Divider, Header } from 'semantic-ui-react';
import firebase from '../firebase';


export default class Articles extends Component {
  state = {
    teamsArticles: [],
    loading: true,
  }
  componentDidMount() {
    const date = new Date();
    const dateArray = date.toLocaleDateString().split('/');
    const month = dateArray[0];
    const feedbackArray = [];
    const chartData = {};
    firebase.database().ref(`sessions/${month}`).on('value', (snap) => {
      const monthData = snap.val();
      Object.keys(monthData).forEach(day => {
        const dayData = monthData[day];
        console.log(`DAY=${day}: ` + JSON.stringify(this.getDayStatistics(dayData), null, 2));
        const { completedSessions, averageWaitTime, rating } = this.getDayStatistics(dayData);
        chartData[day] = {
          completedSessions, 
          averageWaitTime,
          rating
        };
      });
      this.setState({
        chartData
      });
    });
  }


  getDayStatistics(dayData) {
    let completedSessions = 0;
    let totalWaitTime = 0;
    let totalSessionTime = 0;
    let averageWaitTime = 0;
    let rating = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    if(dayData.finished) {
      Object.keys(dayData.finished).forEach( sessionId => {
        const { startTime, chatBeginTime, endTime, rating1 } = dayData.finished[sessionId]; 
        console.log(` ${sessionId}
        START      = ${startTime} 
        CHAT BEGIN = ${chatBeginTime}
        END        = ${endTime}
        `);
        completedSessions += 1;
        rating[rating1] += 1;
        const st = moment(startTime);
        const cbt = moment(chatBeginTime);
        const et = moment(endTime);
        const chatWaitDuration = moment.duration(cbt.diff(st));
        const sessionDuration = moment.duration(et.diff(st));
        totalWaitTime += chatWaitDuration.seconds() || 0;
        totalSessionTime += sessionDuration.seconds() || 0;
      })
    }

    if(totalWaitTime < 0) {
      totalWaitTime = Math.abs(totalWaitTime);
    }

    return {
      completedSessions,
      averageWaitTime: (totalWaitTime/(completedSessions || 1)).toFixed(2),
      rating
    };
  }

  render() {
    return (
      <div className='container'>
        <Header as='h2'>Number of Sessions</Header>
        <Divider />
        { this.plotSessionNumbers() }

        <Header as='h2'>Average Wait Time</Header>
        <Divider />
        { this.plotWaitTime() }
        <Header as='h2'>Ratings</Header>
        <Divider />
        { this.plotRatingSplit() }
      </div>   
    );
  }

  plotRatingSplit() {
    const { chartData = {} } = this.state;
    const gRatings = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    Object.keys(chartData).forEach(day => {
      const { rating } = chartData[day];
      Object.keys(rating).forEach(r => {
        gRatings[r] = gRatings[r] + rating[r];
      });
    });

    const data = {
      labels: [
        '⭐',
        '️️️️⭐⭐',
        '⭐⭐⭐',
        '⭐⭐⭐⭐',
        '⭐⭐⭐⭐⭐'
      ],
      datasets: [{
        data: [gRatings[1],gRatings[2],gRatings[3],gRatings[4],gRatings[5],],
        backgroundColor: [
        'rgba(192, 57, 43, 0.8)',
        'rgba(230, 126, 34, 0.8)',
        'rgba(241, 196, 15, 0.8)',
        'rgba(46, 204, 113, 0.8)',
        'rgba(22, 160, 133, 0.8)',

        ],
        hoverBackgroundColor: [
        'rgba(192, 57, 43, 1.0)',
        'rgba(230, 126, 34, 1.0)',
        'rgba(241, 196, 15, 1.0)',
        'rgba(46, 204, 113, 1.0)',
        'rgba(22, 160, 133, 1.0)',
        ]
      }]
    };
    return (
      <div>
        <Pie data={data} />
      </div>
      );

  }

  plotWaitTime() {

    const { chartData = {} } = this.state;
    const labels = [];
    const barData = [];

    Object.keys(chartData).forEach(day => {
      labels.push(day);
      const { averageWaitTime } = chartData[day];
      barData.push(averageWaitTime)
    })

    const data = {
      labels,
      datasets: [
        {
          label: 'Average Wait Time (secs)',
          backgroundColor: 'rgba(26, 188, 156,0.2)',
          borderColor: 'rgba(22, 160, 133, 1.0)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(22, 160, 133, 1.0)',
          hoverBorderColor: 'rgba(22, 160, 133,1.0)',
          data: barData
        }
      ]
    };
    return (
      <div>
        <Bar
          data={data}
          width={100}
          height={50}
          options={{
            maintainAspectRatio: true
          }}
        />
      </div>
    );
  }

  plotSessionNumbers() {
    const { chartData = {} } = this.state;
    const labels = [];
    const barData = [];

    Object.keys(chartData).forEach(day => {
      labels.push(day);
      const { completedSessions } = chartData[day];
      barData.push(completedSessions)
    });
    const data = {
      labels,
      datasets: [
        {
          label: 'Completed Sessions',
          backgroundColor: 'rgba(26, 188, 156,0.2)',
          borderColor: 'rgba(22, 160, 133, 1.0)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(22, 160, 133, 1.0)',
          hoverBorderColor: 'rgba(22, 160, 133,1.0)',
          data: barData
        }
      ]
    };
    return (
      <div>
        <Bar
          data={data}
          width={100}
          height={50}
          yAxisID={0}
          options={{
            maintainAspectRatio: true,
            scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
            }
          }}
          
        />
      </div>
    );

  }
}