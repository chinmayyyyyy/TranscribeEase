import React, { Component } from 'react'
import loadingSvg from '../Assets/loading.svg'
export default class loader extends Component {
  render() {
    const loadingContainerStyle ={
        width : '50%',
        backgroundColor : 'white',
        padding : '20px',   
        margin :'50px',
        borderRadius : '10px',
        marginLeft : '25%',
        textAlign : 'center',
        color:'black'
    }
    return (
      <div style={loadingContainerStyle} className='loadingContainer'>
            <img  src={loadingSvg} alt="Loading"/>
            <h3>Your Video is being Processed </h3>
            <p>It may take upto 30 seconds .</p>
      </div>
    )
  }
}
