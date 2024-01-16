import React, { Component } from 'react';
import monkey from '../src/assets/monkey.png';
class Home extends Component {
  render() {
    return (
      <div>
        <div style={{
          position: 'relative',
          padding: 20
        }}>
          <h2>JAVANYAJUNE</h2>
          <img alt='' src={monkey} style={{
            width: '150px',
            position: 'absolute',
            top: 0,
            right: 0
            }}/>
        </div>
      </div>
    )
  }
}

export default Home;