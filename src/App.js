import React, { Component } from 'react';
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
        <h1>EMANG BOLEH SE BERHARAP INI?</h1>
      </div>
    )
  }
}

export default Home;