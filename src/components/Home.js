import React, { Component } from 'react';
import { Link } from 'react-router-dom';


export default class Home extends Component {
  state = {
    teamNames: []
  }
  
  render() {
    const { teamNames } = this.state

    return (
      <div className='container'>
        <h1 className='large-header'>
          Chat System
        </h1>
        <h3 className='header text-center'>
          <Link to='/stats'>Live Console  </Link>
        </h3>
      </div>
    )
  }
}
