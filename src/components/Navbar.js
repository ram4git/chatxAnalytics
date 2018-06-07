import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar () {
  return (
    <div className='container navbar'>
      <Link to='/'>Home</Link>
      <nav className='nav-links'>
        <Link to='/stats'>Live Stats</Link>
        <Link to='/feedback'>Feedbacks</Link>
        <Link to='/charts'>Charts</Link>
      </nav>
    </div>
  )
}
