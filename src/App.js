import React, { Component } from 'react';
import NaonSihAh from './assets/naonSihAh.jpg';
class Home extends Component {
  render() {
    return (
      <div style={{
        display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey',
        height: '100vh'
      }}>
        <img
          alt=''
          src={NaonSihAh}
          width={300}
          height={200}
          style={{
            borderRadius: '8px',
            marginTop: '20px'
          }}
        />
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
        {/* <h1>EMANG BOLEH SE BERHARAP INI?</h1> */}
      </div>
    )
  }
}

export default Home;