import React, { Component } from 'react';
import monkey from '../src/assets/monkey.png';
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
          <h2>LAVANYAJUNE</h2>
          <img alt='' src={monkey} style={{
            width: '150px',
            position: 'absolute',
            top: 0,
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