import React, { Component } from 'react';
import monkey from '../src/assets/monkey.png';
import NavBar from './components/NavBar/NavBar';
import ImgMediaCard from './components/Cards';
class Home extends Component {
  render() {
    return (
      <div>
        <NavBar/>
        <div style={{
          position: 'relative',
          padding: 20
        }}>
          <img alt='' src={monkey} style={{
            width: '150px',
            position: 'absolute',
            top: -65,
            right: 0
            }}
          />
          <ImgMediaCard/>
        </div>
      </div>
    )
  }
}

export default Home;