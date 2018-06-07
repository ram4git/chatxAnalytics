import moment from 'moment';
import React, { Component } from 'react';
import { Divider, Header, Segment, Statistic } from 'semantic-ui-react';
import firebase from '../firebase';



export default class Teams extends Component {
  state = {
    teamNames: [],
    loading: true,
  }

  componentDidMount () {
    const date = new Date();
    const dateArray = date.toLocaleDateString().split('/');
    const month = dateArray[0];
    const day = dateArray[1];
    firebase.database().ref(`sessions/${month}/${day}`).on('value', (snap) => {
      const data = snap.val() || { finished: {}, active: {}};

      let totalWaitTime = 0;
      let totalSessionTime = 0;
      let totalFinishedSessions = 0;

      let totalRating1 = 0;
      let totalRating2 = 0;
      let totalRating3 = 0;
      let totalRating1Count = 0;
      let totalRating2Count = 0;
      let totalRating3Count = 0;

      let activeTotalWaitTime = 0;
      let totalActiveSession = 0;


      data.finished && Object.keys(data.finished).forEach( sessionId => {
        const sessionData = data.finished[sessionId];
        const startTime = moment(sessionData.startTime);
        const chatBeginTime = moment(sessionData.chatBeginTime);
        const endTimeTime = moment(sessionData.endTime);
        const chatWaitDuration = moment.duration(chatBeginTime.diff(startTime));
        const sessionDuration = moment.duration(endTimeTime.diff(startTime));
        totalWaitTime = totalWaitTime + (chatWaitDuration.seconds() || 0);
        totalSessionTime = totalSessionTime + (sessionDuration.seconds() || 0);
        if(sessionData.rating1) {
          totalRating1 = totalRating1 + sessionData.rating1;
          totalRating1Count = totalRating1Count + 1;
        }
        if(sessionData.rating2) {
          totalRating2 = totalRating2 + sessionData.rating2;
          totalRating2Count = totalRating2Count + 1;
        }
        if(sessionData.rating3) {
          totalRating3 = totalRating3 + sessionData.rating3;
          totalRating3Count = totalRating3Count + 1;
        }
        totalFinishedSessions = totalFinishedSessions + 1;
      });

      data.active && Object.keys(data.active).forEach( sessionId => {
        const activeSessionData = data.active[sessionId];
        const activeStartTime = moment(activeSessionData.startTime);
        const activeChatBeginTime = moment(activeSessionData.chatBeginTime);
        const activeChatWaitDuration = moment.duration(activeChatBeginTime.diff(activeStartTime));
        activeTotalWaitTime = activeTotalWaitTime + activeChatWaitDuration.seconds();
        totalActiveSession = totalActiveSession + 1;
        console.log(`ACTIVE SESSIONS=${sessionId}
        activeStartTime:     ${activeStartTime}
        activeChatBeginTime: ${activeChatBeginTime}
        activeTotalWaitTime: ${activeTotalWaitTime}
        totalActiveSession: ${totalActiveSession}
        `)
      });

      let avgWaitTimeStr = '0s';
      let avgSessionTimeStr = '0s';
      const avgWaitTime = totalWaitTime/totalFinishedSessions || 0;
      const avgSessionTime = totalSessionTime/totalFinishedSessions || 0;
      if(avgWaitTime > 60) {
        avgWaitTimeStr = (avgWaitTime/60).toFixed(2) + 'm';
      } else {
        avgWaitTimeStr = avgWaitTime.toFixed(2) + 's';
      }

      if(avgSessionTime > 60) {
        avgSessionTimeStr = (avgSessionTime/60).toFixed(2) + 'm';
      } else {
        avgSessionTimeStr = avgSessionTime.toFixed(2) + 's';
      }

      let activeAvgWaitTimeStr = '0s';
      const activeAvgWaitTime = totalActiveSession ? activeTotalWaitTime/totalActiveSession : 0;
      if(activeAvgWaitTime > 60) {
        activeAvgWaitTimeStr = (activeAvgWaitTime/60).toFixed(1) + 'm';
      } else {
        activeAvgWaitTimeStr = activeAvgWaitTime.toFixed(1) + 's';
      }

      this.setState({
        activeSessions: data.active ? Object.keys(data.active).length : 0,
        finishedSessions: data.finished ? Object.keys(data.finished).length : 0,
        averageWaitTime: avgWaitTimeStr,
        averageSessionTime: avgSessionTimeStr,
        averageRating1: (totalRating1/(totalRating1Count || 1)).toFixed(1),
        averageRating2: (totalRating2/(totalRating2Count || 1)).toFixed(1),
        averageRating3: (totalRating3/(totalRating3Count || 1)).toFixed(1),
        activeAvgWaitTime: activeAvgWaitTimeStr
      });

    });

    this.fetchMonthlyStats();

  }


  fetchMonthlyStats() {
    const date = new Date();
    const dateArray = date.toLocaleDateString().split('/');
    const month = dateArray[0];
    firebase.database().ref(`sessions/${month}`).on('value', (snap) => {
      const monthData = snap.val();
      let totalWaitTime = 0;
      let totalSessionTime = 0;
      let totalFinishedSessions = 0;
      let totalActiveSessions = 0;

      let totalRating1 = 0;
      let totalRating2 = 0;
      let totalRating3 = 0;
      let totalRating1Count = 0;
      let totalRating2Count = 0;
      let totalRating3Count = 0;

      Object.keys(monthData).forEach(day => {
        const data = monthData[day];
        Object.keys(data.finished).forEach( sessionId => {
          const sessionData = data.finished[sessionId];
          const startTime = moment(sessionData.startTime);
          const chatBeginTime = moment(sessionData.chatBeginTime);
          const endTimeTime = moment(sessionData.endTime);
          const chatWaitDuration = moment.duration(chatBeginTime.diff(startTime));
          const sessionDuration = moment.duration(endTimeTime.diff(startTime));
          totalWaitTime = totalWaitTime + (chatWaitDuration.seconds() || 0);
          totalSessionTime = totalSessionTime + (sessionDuration.seconds() || 0);
          if(sessionData.rating1) {
            totalRating1 = totalRating1 + sessionData.rating1;
            totalRating1Count = totalRating1Count + 1;
          }
          if(sessionData.rating2) {
            totalRating2 = totalRating2 + sessionData.rating2;
            totalRating2Count = totalRating2Count + 1;
          }
          if(sessionData.rating3) {
            totalRating3 = totalRating3 + sessionData.rating3;
            totalRating3Count = totalRating3Count + 1;
          }
          totalFinishedSessions = totalFinishedSessions + 1;
        });

        totalActiveSessions = data.active ? Object.keys(data.active).length : 0;

      });

      let avgWaitTimeStr = '0s';
      let avgSessionTimeStr = '0s';
      const avgWaitTime = totalWaitTime/totalFinishedSessions || 0;
      const avgSessionTime = totalSessionTime/totalFinishedSessions || 0;
      if(avgWaitTime > 60) {
        avgWaitTimeStr = (avgWaitTime/60).toFixed(2) + 'm';
      } else {
        avgWaitTimeStr = avgWaitTime.toFixed(2) + 's';
      }

      if(avgSessionTime > 60) {
        avgSessionTimeStr = (avgSessionTime/60).toFixed(2) + 'm';
      } else {
        avgSessionTimeStr = avgSessionTime.toFixed(2) + 's';
      }

      this.setState({
        monthActiveSessions: totalActiveSessions || 0,
        monthFinishedSessions: totalFinishedSessions || 0,
        monthAverageWaitTime: avgWaitTimeStr,
        monthAverageSessionTime: avgSessionTimeStr,
        monthAverageRating1: (totalRating1/(totalRating1Count || 1)).toFixed(1),
        monthAverageRating2: (totalRating2/(totalRating2Count || 1)).toFixed(1),
        monthAverageRating3: (totalRating3/(totalRating3Count || 1)).toFixed(1),
      });
    });
  }

  render () {
    const { loading, teamNames } = this.state
    const { location, match } = this.props
    return (
      <div className='container'>
        <Header as='h2'>Now</Header>
        <Divider />
        { this.renderNowStats() }
        <Header as='h2'>Today</Header>
        <Divider />
        { this.renderTodayStats() }
        <Header as='h2'>This Week</Header>
        <Divider />
        { this.renderThisWeekStats() }

			</div>
    )
  }

  renderTodayStats() {
    return(
      <div>
        <Segment.Group raised className='section' style={{backgroundColor: '#ecf0f1'}}>
          <Statistic.Group>
            <Statistic color='blue'>
              <Statistic.Value>{this.state.finishedSessions}</Statistic.Value>
              <Statistic.Label>Serviced Users</Statistic.Label>
            </Statistic>
            <Statistic color='blue'>
              <Statistic.Value>{this.state.averageSessionTime}</Statistic.Value>
              <Statistic.Label>Average Session</Statistic.Label>
            </Statistic>
            <Statistic color='blue'>
              <Statistic.Value>{this.state.averageWaitTime}</Statistic.Value>
              <Statistic.Label>Wait Time</Statistic.Label>
            </Statistic>
          </Statistic.Group>
          <Statistic.Group>
            <Statistic color={this.getColorCode(this.state.averageRating1)}>
              <Statistic.Value>{this.state.averageRating1}/5</Statistic.Value>
              <Statistic.Label>Overall Feedback</Statistic.Label>
            </Statistic>
            <Statistic color={this.getColorCode(this.state.averageRating2)}>
              <Statistic.Value>{this.state.averageRating2}/5</Statistic.Value>
              <Statistic.Label>Agent Feedback</Statistic.Label>
            </Statistic>
            <Statistic color={this.getColorCode(this.state.averageRating3)}>
              <Statistic.Value>{this.state.averageRating3}/5</Statistic.Value>
              <Statistic.Label>App Feedback</Statistic.Label>
            </Statistic>
          </Statistic.Group>
        </Segment.Group>
      </div>
    )

  }

  getColorCode(quantity) {
    const num = parseFloat(quantity) || 0;
    if(num >= 4) {
      return 'green';
    } else if (num >= 3) {
      return 'orange';
    } else if (num > 0) {
      return 'red'
    }
    return 'blue';
  }

  renderThisWeekStats() {
    return(
      <div>
        <Segment.Group raised className='section' style={{backgroundColor: '#ecf0f1'}}>
          <Statistic.Group>
            <Statistic color='blue'>
              <Statistic.Value>{this.state.monthFinishedSessions}</Statistic.Value>
              <Statistic.Label>Serviced Users</Statistic.Label>
            </Statistic>
            <Statistic color='blue'>
              <Statistic.Value>{this.state.monthAverageSessionTime}</Statistic.Value>
              <Statistic.Label>Average Session</Statistic.Label>
            </Statistic>
            <Statistic color='blue'>
              <Statistic.Value>{this.state.monthAverageWaitTime}</Statistic.Value>
              <Statistic.Label>Wait Time</Statistic.Label>
            </Statistic>
          </Statistic.Group>
          <Statistic.Group>
            <Statistic color={this.getColorCode(this.state.monthAverageRating1)}>
              <Statistic.Value>{this.state.monthAverageRating1}/5</Statistic.Value>
              <Statistic.Label>Overall Feedback</Statistic.Label>
            </Statistic>
            <Statistic color={this.getColorCode(this.state.monthAverageRating2)}>
              <Statistic.Value>{this.state.monthAverageRating2}/5</Statistic.Value>
              <Statistic.Label>Agent Feedback</Statistic.Label>
            </Statistic>
            <Statistic color={this.getColorCode(this.state.monthAverageRating3)}>
              <Statistic.Value>{this.state.monthAverageRating3}/5</Statistic.Value>
              <Statistic.Label>App Feedback</Statistic.Label>
            </Statistic>
          </Statistic.Group>
        </Segment.Group>
      </div>
    );
  }

  renderNowStats() {
    return (
      <Segment.Group raised className='section' style={{backgroundColor: '#ecf0f1'}}>
        <Statistic.Group size='huge'>
          <Statistic color='green'>
            <Statistic.Value>{this.state.activeSessions}</Statistic.Value>
            <Statistic.Label>Active Sessions</Statistic.Label>
          </Statistic>
          <Statistic color='orange'>
            <Statistic.Value>{this.state.activeAvgWaitTime}</Statistic.Value>
            <Statistic.Label>Average Wait Time</Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </Segment.Group>
    );
  }
}
