import React, { Component } from 'react';
import monkey from '../src/assets/monkey.png';
import NavBar from './components/NavBar/NavBar';
import ImgMediaCard from './components/Cards';
class Home extends Component {
  render() {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* <div style={{
          position: 'relative',
          padding: 20
        }}>
          <img alt='' src={monkey} style={{
            width: '150px',
            position: 'absolute',
            top: -65,
            right: 0
            }}/>
        </div> */}
        <h1>GAK ADA APA-APA :)</h1>
        <h3>hahahahaha</h3>
      </div>
    )
  }
}

export default Home;