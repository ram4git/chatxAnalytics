import moment from 'moment';
import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Divider, Header, Rating, Table } from 'semantic-ui-react';
import firebase from '../firebase';




export default class Players extends Component {
  state = {
    feedback: [],
    loading: true,
  }
  componentDidMount () {
    const date = new Date();
    const dateArray = date.toLocaleDateString().split('/');
    const month = dateArray[0];
    const feedbackArray = [];
    firebase.database().ref(`sessions/${month}`).on('value', (snap) => {
      const monthData = snap.val();

      Object.keys(monthData).forEach(day => {
        const dayData = monthData[day];
        Object.keys(dayData.finished).forEach( sessionId => {
          feedbackArray.push({...dayData.finished[sessionId], sessionId });
        });
      });
      this.setState({
        feedback: feedbackArray
      });
    });
  }

  render () {
    return (
      <div className='container'>
        <Header as='h2'>All Feedbacks</Header>
        <Divider />
        { this.renderFeedbackTable() }
      </div>
    );
  }

  renderFeedbackTable() {
    return (
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell singleLine>SNO</Table.HeaderCell>
            <Table.HeaderCell singleLine>Timestamp</Table.HeaderCell>
            <Table.HeaderCell>Session Time</Table.HeaderCell>
            <Table.HeaderCell>Wait Time</Table.HeaderCell>
            <Table.HeaderCell>Rating</Table.HeaderCell>
            <Table.HeaderCell width>Feedback</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
  
        <Table.Body>
          { this.renderTableRows() }
        </Table.Body>
      </Table>
    );
  }

  renderTableRows() {
    const rowsArray = [];
    const { feedback } = this.state;
    if(!feedback.length) {
      return true;
    }
    let index = 1;

    feedback.reverse().forEach( rowData => {
      const { chatBeginTime, endTime, startTime, rating1, rating2, rating3, feedback } = rowData;
      const st = moment(startTime);
      const cbt = moment(chatBeginTime);
      const et = moment(endTime);
      const chatWaitDuration = st.to(cbt, true);
      const sessionDuration = st.to(et, true);
      console.log('ROW DATA=', JSON.stringify(rowData, null, 2));
      rowsArray.push(
        <Table.Row key={index}>
          <Table.Cell collapsing>
            { index }
          </Table.Cell>
          <Table.Cell collapsing>
            { st.format('MMM/DD/YYYY hh:mm:ss A') }
          </Table.Cell>
          <Table.Cell collapsing>
            { chatWaitDuration }
          </Table.Cell>
          <Table.Cell collapsing>
            { sessionDuration }
          </Table.Cell>
          <Table.Cell collapsing>
            <div>
            <Rating icon='star' defaultRating={rating1} maxRating={5} disabled /> : chat
            <br />
            <Rating icon='star' defaultRating={rating2} maxRating={5} disabled /> : agent
            <br />
            <Rating icon='star' defaultRating={rating3} maxRating={5} disabled /> : app
            </div>
          </Table.Cell>
          <Table.Cell>
            { feedback }
          </Table.Cell>
        </Table.Row>
      );
      index = index + 1;
    });

    return rowsArray;
  }
}
